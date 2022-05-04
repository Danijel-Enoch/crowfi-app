
import { ContextApi } from 'contexts/Localization/types'
import { escapeRegExp } from 'lodash'
import { FormErrors, FormState, urlReg } from './types'


export const getFormErrors = (formData: FormState, isEditing: boolean, t: ContextApi['t']) => {
    const error: FormErrors = {}
    let valid = true

    if (!isEditing && !formData.logoFile) {
        error.logo = t("Logo is required")
        valid = false
    }

    if (!formData.name || formData.name.length === 0) {
        error.name = t('Name is required')
        valid = false
    }

    if (!isEditing) {
        if (formData.mintable) {
    
            if (!formData.symbol || formData.symbol.length === 0) {
                error.symbol = t('Symbol is required')
                valid = false
            } else if (formData.symbol.length > 20) {
                error.symbol = t('Symbol max length is 20')
                valid = false
            }
        } else {
            error.symbol = undefined
        }
    }
    
    
    if (formData.site && formData.site.length > 0 && urlReg.test(escapeRegExp(formData.site))) {
        error.site = t('Site link is invalid')
        valid = false
    }
  
    return {valid, error}
  }