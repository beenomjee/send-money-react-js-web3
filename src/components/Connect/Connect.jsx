import React from 'react'
import styles from './Connect.module.scss'
import { GiWallet } from 'react-icons/gi'
import Loader from '../Loader/Loader'

const Connect = ({ onClickConnect, isLoading }) => {
    return (
        <div className={styles.center}>
            <div className={styles.container}>
                <h1>Send Money</h1>
                <p>Connect to MetaMask to start sending money.</p>
                <button disabled={isLoading} onClick={onClickConnect}>{isLoading ? <Loader /> : (<><GiWallet /><span>Connect to MetaMask</span></>)}</button>
            </div>
        </div>
    )
}

export default Connect