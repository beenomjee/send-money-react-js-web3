import React, { useCallback, useRef, useState } from 'react'
import { Connect, Form } from '../../components'
import detectEthereumProvider from '@metamask/detect-provider'
import { toast } from 'react-toastify';
import { ethers, formatEther, parseEther } from "ethers";
import Contract from '../../contracts/MoneyTransfer.json'

const Home = () => {
    const [isConnect, setIsConnect] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [contract, setContract] = useState(null);
    const sendToInputBoxRef = useRef(null);
    const [data, setData] = useState({
        sendTo: '',
        amount: '0.0001',
        yourBalance: '',
        yourAddress: '',
    })

    const setDefaultValues = useCallback(() => {
        setData(p => ({ ...p, sendTo: '', amount: '0.0001' }))
        sendToInputBoxRef.current.focus();
    }, []);

    const onAccountChange = async (yourAddress, provider) => {
        const yourBalance = formatEther(await provider.getBalance(yourAddress));
        setData(p => ({ ...p, yourBalance, yourAddress }))
    }

    const onClickConnect = async e => {
        setIsLoading(true);
        const ethereumProvider = await detectEthereumProvider()

        if (!ethereumProvider) {
            toast.error("Please install metamask first!");
            setIsLoading(false);
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(ethereumProvider)
            const signer = await provider.getSigner();

            // setting first time and when account changed
            onAccountChange(await signer.getAddress(), provider);
            ethereumProvider.on('accountsChanged', accounts => onAccountChange(accounts[0], provider));

            const contract = new ethers.Contract(Contract.address, Contract.abi, signer);
            setContract(contract);

            setIsLoading(false);
            setIsConnect(true);
            toast.success("Logined!");
        } catch (err) {
            console.log(err);
            if (err.code === 'ACTION_REJECTED')
                toast.error("This permission is required to use this app!");
            else
                toast.error("Something went wrong. Please try again!");
            setIsLoading(false);
        }
    }

    const onClickSendMoney = async e => {
        setIsLoading(true)
        e.preventDefault();
        try {
            const transaction = await contract.sendMoney(data.sendTo, { value: parseEther(data.amount) });
            toast.info("Waiting for conformation...");
            await transaction.wait();
            toast.success('Transferred!')
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            toast.error(err.reason);
            setIsLoading(false)
        }
        setDefaultValues();
    }

    return (
        <div>
            {isConnect ? (
                <Form onClickSendMoney={onClickSendMoney} isLoading={isLoading} data={data} setData={setData} sendToInputBoxRef={sendToInputBoxRef} setDefaultValues={setDefaultValues} />
            ) : (
                <Connect onClickConnect={onClickConnect} isLoading={isLoading} />
            )
            }
        </div>
    )
}

export default Home