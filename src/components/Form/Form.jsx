import React, { forwardRef, useLayoutEffect } from 'react'
import styles from './Form.module.scss'
import Loader from '../Loader/Loader'

const Input = forwardRef(({ id, label, ...props }, ref) => {
    return (
        <div className={styles.input}>
            <label htmlFor={id}>{label}</label>
            <input {...props} id={id} ref={ref} />
        </div>
    )
})

const Form = ({ onClickSendMoney, isLoading, data, setData, sendToInputBoxRef, setDefaultValues }) => {
    const onChange = e => {
        setData(p => ({
            ...p,
            [e.target.id]: e.target.value
        }))
    }

    useLayoutEffect(() => { setDefaultValues() }, [setDefaultValues])
    return (
        <div className={styles.center}>
            <form onSubmit={onClickSendMoney} className={styles.container}>
                <h1>Send Money</h1>
                <p>Fill the form and click button to send money.</p>
                <Input type="text" label="Your Address" id="sendTo" disabled defaultValue={data.yourAddress} />
                <Input type="text" label="Your balance" id="sendTo" disabled defaultValue={data.yourBalance} />
                <Input ref={sendToInputBoxRef} type="text" label="Send to" id="sendTo" required placeholder="Address" value={data.sendTo} onChange={onChange} />
                <Input type="number" step="0.0001" label="Amount" id="amount" required placeholder="Amount in ethereum" min="0.0001" value={data.amount} onChange={onChange} />
                <button disabled={isLoading}>{isLoading ? <Loader /> : 'Send'}</button>
            </form>
        </div>
    )
}

export default Form