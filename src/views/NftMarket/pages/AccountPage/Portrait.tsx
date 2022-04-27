import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import {useDropzone} from 'react-dropzone'
import { Button, Flex, LogoIcon, PencilIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Loading from 'components/Loading'

const Wrapper = styled.div`
    margin-top: -80px;
    position: relative;
    border: 2px solid rgb(255, 255, 255);
    background-color: rgb(255, 255, 255);
    border-radius: 50%;
    overflow: hidden;
`

const Dropzone = styled.div`
    display: flex;
    justify-content:center;
    align-items:center;
    
    .edit {
        display: none;
    }

    &:hover > .edit {
        display: flex;
    }
`

const EditIcon = styled.div`
    display: flex;
    justify-content:center;
    align-items:center;
    position: absolute;
    background: rgba(0,0,0,0.1);
    top:0;
    right:0;
    bottom: 0;
    left: 0;
`


const Placeholder = styled.div`
    width: 130px;
    height: 130px;
    display: flex;
    justify-content:center;
    align-items:center;
`

const Image = styled.img`
    display: flex;
    object-fit: cover;
    width: 130px;
    height: 130px;
`

const LoadingWrapper = styled.div`
    display: flex;
    align-items:center;
    justify-content: center;
    position: absolute;
    top:0;
    right:0;
    bottom: 0;
    left: 0;
`

const CloseButton = styled(Button).attrs({variant:"text"})`
    position: absolute;
    top: 0;
    right: 0;
    padding: 0px 12px;
    >svg {
        -webkit-filter: drop-shadow(0px 0px 3px rgba(0,0,0,0.6));
        filter: drop-shadow(0px 0px 3px rgba(0,0,0,0.6));
    }
`

const Changebutton = styled(Button).attrs({variant:"text", color:"white"})`
    border-top-left-radius: unset;
    border-top-right-radius: unset;
    &:hover {
        background: rgba(0,0,0,0.1);
    }
`

interface PortraitProps {
  onSelect?: (file: File) => void
  image?: string
  enabled?: boolean
}

const Portrait: React.FC<PortraitProps> = ({onSelect, image, enabled}) => {

    const { t } = useTranslation()
    const [file, setFile] = useState(null)
    const {
        getRootProps, 
        getInputProps, 
        isDragActive
    } = useDropzone({
        accept: 'image/*',
        multiple: false,
        maxSize:1024*1024*100,
        onDrop: acceptedFiles => {
            const file_ = Object.assign(acceptedFiles[0], {
                preview:URL.createObjectURL(acceptedFiles[0])
            })
            setFile(file_)
            onSelect(file_)
        }
    })

    return (
        <>
        <Wrapper >
            { enabled ? (
            <Dropzone {...getRootProps()}>
                <input {...getInputProps} style={{display:"none"}}/>
                {!image && (
                    <Placeholder>
                        <LogoIcon width="120px" opacity="0.3"/>
                    </Placeholder>
                )}
                {!image && file && (
                    <LoadingWrapper>
                    <Loading/>
                    </LoadingWrapper>
                )}
                {image && (
                    <>
                    <Image src={image}/> 
                    </>
                )}

                <EditIcon className="edit">
                    <PencilIcon color="white"/>
                </EditIcon>
            </Dropzone>
            ) : (
                <Flex>
                {image ? (
                    <>
                    <Image src={image}/> 
                    </>
                ) : (
                    <Placeholder>
                        <LogoIcon width="120px" opacity="0.3"/>
                    </Placeholder>
                )}
                </Flex>
            )}
        </Wrapper>
        </>
    )
}

Portrait.defaultProps = {
    enabled: true
}

export default Portrait 