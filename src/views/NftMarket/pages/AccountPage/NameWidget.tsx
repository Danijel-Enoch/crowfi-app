import React, { useCallback, useMemo, useState } from 'react'
import styled, {css} from 'styled-components'
import {useDropzone} from 'react-dropzone'
import { Box, CheckmarkIcon, CloseIcon, Flex, FlexProps, Heading, IconButton, PencilIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Loading from 'components/Loading'
import { StyledTextInput } from 'components/Launchpad/StyledControls'
import { useUpdateProfile } from '../../hooks/useProfile'


const NameWrapper = styled(Flex)<{editable: boolean}>`
    position: relative;

    ${(props) =>
        props.editable &&
        css`
        cursor:pointer;
        `}
`

const EditIcon = styled.div`
    display: flex;
    justify-content:center;
    align-items:center;
`

const ActionButton = styled(IconButton).attrs({variant:"text", color:"primary"})`
    height: 40px;
`

interface NameWidgetProps extends FlexProps{
  name?: string
  enabled: boolean
  onUpdate: (name: string) => Promise<boolean>
}

const NameWidget: React.FC<NameWidgetProps> = ({name, enabled, onUpdate, ...props}) => {

    const { t } = useTranslation()

    const [editing, setEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [val, setVal] = useState(name)

    const startEditing = () => {
        if (!editing) {
            setEditing(true)
            setVal(name)
        }
    }

    const cancelEditing = () => {
        setEditing(false)
        setVal('')
    }

    const handleSave = useCallback(async () => {
        try {
            setSaving(true)
            const res = await onUpdate(val)
            if (res) {
                cancelEditing()
            }
        } finally {
            setSaving(false)
        }
    }, [val, onUpdate])
    return (
        <NameWrapper 
            onClick={startEditing}
            editable={enabled && !editing} 
            position="relative" {...props}
            >
                {editing ? (
                    <Flex>
                        <Flex width="80px"/>
                        <StyledTextInput
                            value={val}
                            onUserInput={(val_) => setVal(val_)}
                            />
                        <Flex width="80px" justifyContent="end">
                            <ActionButton disabled={saving} onClick={handleSave}>
                                <CheckmarkIcon color="primary"/>
                            </ActionButton>
                            <ActionButton disabled={saving} onClick={cancelEditing}>
                                <CloseIcon color="primary"/>
                            </ActionButton>
                        </Flex>
                    </Flex>
                ) : (
                    <>
                    <Heading>
                        {name && name.length > 0 ? name : t('Unnamed')}
                    </Heading>
                    {enabled && (
                    <EditIcon className="edit">
                        <PencilIcon color="black" width="16px" ml="8px"/>
                    </EditIcon>
                    )}
                    </>
                )}
        </NameWrapper>
    )
}
NameWidget.defaultProps = {
    enabled: true
}
export default NameWidget 