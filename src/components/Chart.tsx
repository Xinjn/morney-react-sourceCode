import React, { useEffect,useRef}from 'react';
import echarts from 'echarts';


type Props = {
  option:any
}
const Chart = (props: Props) => {
    const {option} = props
    const container = useRef<any>(null)
    const chart = useRef<any>(null)
    useEffect(() => {
        const width = document.documentElement.clientWidth
        container.current.style.width = `${width}px`
        container.current.style.height = `${width * 1}px`
        chart.current = echarts.init(container.current as HTMLDivElement)
    })
    useEffect(() => {
        chart.current.setOption(option)
    }, [option])
    return (
        <div ref={container}/>
    )
}

export default Chart