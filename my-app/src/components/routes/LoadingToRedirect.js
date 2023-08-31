import React,{useState,useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

export const LoadingToRedirect = () => {
    const [count,setCount] = useState(5)
    let history= useNavigate();

    useEffect(() => {
      const interval=
       setInterval(()=>{

        setCount((currentCount)=> --currentCount)

            
        },1000)
        //^redirect when count =0

        count===0 && history.push('/login')
        //^clean

        return ()=>clearInterval(interval)
        
    }, [count])

    return (
        <div className="container p-5 text-center">
        <p>Redirecting you in {count} seconds</p>
            
        </div>
    )
}


export default LoadingToRedirect;