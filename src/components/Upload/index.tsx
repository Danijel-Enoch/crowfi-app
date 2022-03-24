import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import {useDropzone} from 'react-dropzone'
import { Button, CloseIcon, NoProfileAvatarIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

const Wrapper = styled.div<{borderRadius?: string}>`
    position: relative;
    border: 2px dashed rgb(204, 204, 204);
    border-radius: ${({ borderRadius }) => (borderRadius ? `${borderRadius}` : '8px')};
`

const Dropzone = styled.div`
    display: flex;
    justify-content:center;
    align-items:center;
`


const Placeholder = styled.div<{width?: string, height?: string}>`
    width: ${({ width }) => (width ? `${width}` : '300px')};
    height: ${({ height }) => (height ? `${height}` : '200px')};
    display: flex;
    justify-content:center;
    align-items:center;
`

const Image = styled.img<{width?: string, height?: string, borderRadius?: string}>`
    display: flex;
    object-fit: cover;
    width: ${({ width }) => (width ? `${width}` : '300px')};
    height: ${({ height }) => (height ? `${height}` : '200px')};
    border-radius: ${({ borderRadius }) => (borderRadius ? `${borderRadius}` : '8px')};
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

interface UploadProps {
    width?: string
    height?: string
    placeholderSize?: string
    borderRadius?: string
    accept?: string
    showClose?: boolean
  onSelect: (file: File) => void
}

const Upload: React.FC<UploadProps> = ({onSelect, width, height, borderRadius, accept, showClose, placeholderSize}) => {

    const { t } = useTranslation()

    const [file, setFile] = useState(null)
    const {
        getRootProps, 
        getInputProps, 
        isDragActive
    } = useDropzone({
        accept,
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
        <Wrapper borderRadius={borderRadius}>
            { file && file.type.includes('video') && (
                <video controls src={file.preview}/>
            )}
            { file && file.type.includes('audio') && (
                <audio controls src={file.preview}/>
            )}
            <Dropzone {...getRootProps()}>
                <input {...getInputProps} style={{display:"none"}}/>
                {!file && (
                    <Placeholder width={width} height={height}>
                        <NoProfileAvatarIcon width={placeholderSize}/>
                    </Placeholder>
                )}
                {file && file.type.includes('image') && (
                    <>
                    <Image src={file.preview} width={width} height={height} borderRadius={borderRadius}/> 
                    </>
                )}
                {file && !file.type.includes('image') && (
                    <Changebutton width="100%">
                        {t('Change')}
                    </Changebutton>
                )}
            </Dropzone>
            {file && file.type.includes('image') && showClose && (
                <CloseButton
                onClick={() => setFile(null)}
                >
                    <CloseIcon width="24px" color="white"/>
                </CloseButton>
            )}
        </Wrapper>
        </>
    )
}

Upload.defaultProps = {
    width: '300px',
    height: '200px',
    placeholderSize: '160px',
    borderRadius: '8px',
    accept: 'image/*,video/*,audio/*',
    showClose: true
}

export default Upload 