import { useState, useEffect } from 'react';
import { useUpdate } from 'hooks/useUpdate';
import dayjs from 'dayjs';



export type RecordItem = {
    tagIds: number[]
    note: string
    category: "+" | "-"
    amount: number
    createdAt: string
    date: string
    
   
}
type newRecordItem = Omit<RecordItem,'createdAt'>

export const useRecords = () => {
    const [records, setRecord] = useState<RecordItem[]>([])
    
    const addRecord = (newRecord: newRecordItem) => {
        if (newRecord.amount <= 0) {
            alert('请输入数值')
            return false
        }
        if (newRecord.tagIds.length === 0) {
            alert('请选择标签')
            return false
            
        }
        
        const dateValue = dayjs(newRecord.date).format('YYYY-MM-DD')
        const record = {...newRecord,createdAt:(new Date().toISOString()),date:(dateValue)}
        setRecord([...records, record])
        return true
    }

    useUpdate(() => {
        window.localStorage.setItem('records',JSON.stringify(records))
    }, records)
    
    useEffect(() => {
        setRecord(JSON.parse(window.localStorage.getItem('records') || '[]'))
    }, [])
 
    return {records,addRecord}
}
