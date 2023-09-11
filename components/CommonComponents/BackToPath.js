import Link from 'next/link'
import styles from '../../styles/Home.module.scss'

export default function BackToPath(props) {

    return (
        <div className={styles.categoryDetailsTable}>
            {props.backPathArray.map((pathName, index) => {
                return (
                    <>
                        {props.backpathForTabel ?
                            <div>
                                {pathName.handleClick ?
                                    <p className={`normalLinkText ${styles.displayLinkText}`} onClick={pathName.handleClick}>{pathName.lable}</p>
                                    :
                                    <p className={` ${styles.displayAdminText}`} >{pathName.lable}</p>
                                }
                                {(index + 1) !== props.backPathArray.length && <p className={styles.categoryDetailsName}>{'>'}</p>}
                            </div>
                            :
                            <div>
                                {pathName.link == null ?
                                    <p className={` ${styles.displayAdminText}`} >{pathName.lable}</p>
                                    :
                                    <Link className={`normalLinkText ${styles.displayLinkText}`} href={pathName.link} >{pathName.lable}</Link>
                                }
                                {(index + 1) !== props.backPathArray.length && <p className={styles.categoryDetailsName}>{'>'}</p>}
                            </div>
                        }
                    </>
                )
            })}
        </div>
    )
}
