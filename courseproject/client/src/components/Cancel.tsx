import { Spinner } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

const Cancel = () => {
    const navigate =  useNavigate()
    localStorage.setItem(import.meta.env.VITE_COURSE_KEY,"")
    setTimeout(()=>{navigate("/dashboard")},3000)
    
  return (
    <>
    <div style={{height : 300 ,display : "flex",alignItems : "center",justifyContent : "center"}}>
    <p style={{color : "red"}}>Transaction Failed try again Later ,<span style={{color : "blue"}}> Redirecting to Dashboard Please Wait  </span></p>
    <br/>
    <Spinner/>
    </div>
    </>
  )
}

export default Cancel