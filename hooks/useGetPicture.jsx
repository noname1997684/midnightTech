import { useState } from "react"

const useGetPicture = () => {
    const [picURL,setPicURL]= useState(null)
    const [picURLs,setPicURLs]= useState([])

    const handleMultiplePicChange= async(e)=>{
        const files = e.target.files
        if(!files || files.length === 0) return
        
        const urls = []
        for(let i=0; i<files.length; i++){
            const file = files[i]
            if(!file.type.includes('image')) continue
            
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload=()=>{
                urls.push(reader.result)
                if(urls.length === files.length){
                    setPicURLs(urls)
                }
            }
        }
    }
    const handlePicChange= async(e)=>{
        
        const file = e.target.files[0]
        if(!file || !file.type.includes('image')){
            setPicURL(null)
            return
        }
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload=()=>{
            setPicURL(reader.result)
        }
    }

  return {handlePicChange,picURL,setPicURL,handleMultiplePicChange,picURLs,setPicURLs}
}

export default useGetPicture