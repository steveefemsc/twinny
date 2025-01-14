import { MESSAGE_KEY, MESSAGE_NAME } from '../constants'
import cn from 'classnames'

import styles from './index.module.css'
import { useTemplates, useWorkSpaceContext } from './hooks'
import { kebabToSentence } from './utils'
import { useEffect, useState } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const global = globalThis as any
export const Suggestions = ({ isDisabled }: { isDisabled?: boolean }) => {
  const templateContext = useWorkSpaceContext<string[]>(
    MESSAGE_KEY.selectedTemplates
  )
  const { templates, saveTemplates } = useTemplates()
  const [suggestions, setSuggestions] = useState<string[]>()

  const handleOnClickSuggestion = (message: string) => {
    if (isDisabled) return

    global.vscode.postMessage({
      type: MESSAGE_NAME.twinnyClickSuggestion,
      data: message
    })
  }

  const fixDeletedTemplates = (savedTemplates: string[]) => {
    const availableTemplates = savedTemplates.filter((template) =>
      templates?.includes(template)
    )
    if (availableTemplates.length !== savedTemplates.length) {
      saveTemplates(availableTemplates)
    }
    return availableTemplates
  }

  useEffect(() => {
    if (!templateContext?.length) {
      return
    }
    const filteredTemplates = fixDeletedTemplates(templateContext)
    setSuggestions(filteredTemplates)
  }, [templates])

  return (
    <div className={styles.suggestions}>
      {suggestions?.map((name) => (
        <div
          onClick={() => handleOnClickSuggestion(name)}
          key={name}
          className={cn(styles.suggestion, {
            [styles['suggestion--disabled']]: isDisabled
          })}
        >
          <div>{kebabToSentence(name)}</div>
        </div>
      ))}
    </div>
  )
}
