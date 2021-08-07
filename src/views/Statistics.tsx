import Layout from '../components/Layout';
import React, {ReactNode, useState} from 'react';
import {CategorySection} from './Money/CategorySection';
import styled from 'styled-components';
import {RecordItem, useRecords} from '../hooks/useRecords';
import {useTags} from '../hooks/useTags';
import day from 'dayjs';
import Chart from '../components/Chart';
import _ from "lodash";
import dayjs from 'dayjs';

import clone from 'lib/clone';


const CategoryWrapper = styled.div`
  background:white;
`;

const Item = styled.div`
  display:flex;
  justify-content: space-between;
  background: white;
  font-size: 18px;
  line-height: 20px;
  padding: 10px 16px;
  > .note{
    margin-right: auto;
    margin-left: 16px;
    color: #999;
  }
`;
const Header = styled.h3`
  font-size: 18px;
  line-height: 20px;
  padding: 10px 16px;
  display: flex;
  justify-content: space-between;
  align-content: center;
`;


function Statistics() {
  const { records} = useRecords();
  const [category, setCategory] = useState<'-' | '+'>('-');

  const { getName } = useTags();


  const hash: { [K: string]: RecordItem[] } = {}; // {'2020-05-11': [item, item], '2020-05-10': [item, item], '2020-05-12': [item, item, item, item]}
  const selectedRecords = records.filter(r => r.category === category)
  
  selectedRecords.forEach(r => {
    const key = day(r.date).format('YYYY年MM月DD日');
    if (!(key in hash)) {
      hash[key] = [];
    }
    hash[key].push(r);
  });

  const array = Object.entries(hash).sort((a, b) => {
    if (a[0] === b[0]) return 0;
    if (a[0] > b[0]) return -1;
    if (a[0] < b[0]) return 1;
    return 0;
  });
  

    const dayTotalList  = (type:string) => {
      const newList = clone(records)
              .filter(r => r.category === type)
              .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())
      
      type Result = {
          title: string, 
          total: number,
          items: RecordItem[]
      }[]
      if (newList.length === 0) {return [];}

      const result: Result = [{
          title: dayjs(newList[0].date).format('YYYY-MM-DD'),
          total: 0,
          items: [newList[0]]
      }];
      
      for(let i = 1;i<newList.length;i++){
          const current = newList[i] 
          const last = result[result.length - 1]
              if(dayjs(last.title).isSame(dayjs(current.date),'day')){
                  last.items.push(current)
              }else{
                  result.push({
                      title: dayjs(current.date).format('YYYY-MM-DD'),
                      total: 0,
                      items: [current]
                  })
              }
      }
      result.map(group =>
              group.total = group.items.reduce((sum, item) => {
                return sum + item.amount;
              }, 0));
      return result
        
    };
 
    const keyValueList = () => {
        
        const today = new Date()
        const array = []
        
        for (let i = 0; i <= 29; i++){
            const dateString = day(today)
                .subtract(i, 'day').format('YYYY-MM-DD')
            const found = _.find(dayTotalList(category), { title: dateString })
            array.push({
                date:dateString,value:found ?found.total :0
            })
            
        }
            array.sort((a,b) => {
                if(a.date > b.date){
                    return 1
                }else if(a.date === b.date){
                    return 0
                }else{
                    return -1
                }
            })
        return array
    }
    const chartOption = () => {
        const keys = keyValueList().map(item => item.date)
        const values = keyValueList().map(item => item.value)
      return {
                xAxis: {
                    type: 'category',
                    data: keys,
                        axisTick:{alignWithLabel:true},
                        axisLine:{lineStyle:{color:'#666'}},
                        axisLabel:{
                            formatter:function(value:string,index:number){
                                return value.substr(5)
                            }
                        }
                },
                yAxis: {
                    type: 'value',
                    
                },
                series: [{
                    symbol:'circle',
                    symbolSize:12,
                    itemStyle:{borderWidth:1,color:'#666',borderColor:'#666'},
                    data:values,
                    type: 'line'
                }],
                tooltip:{
                    show:true,
                    triggerOn:'click',
                    position:'top',
                    formatter:'{c}'
                    }
        }
    }

  return (
    <Layout>
      <CategoryWrapper>
        <CategorySection value={category}
          onChange={value => setCategory(value)}/>
      </CategoryWrapper>
      
      <Chart option={chartOption()} />

      {array.map(([date, records]) => <div key={date}>

        <Header>
          {date}
          <span>
            {dayTotalList(category).map((group, index) => {
              return <span key={index}>
                {date === day(group.title).format('YYYY年MM月DD日') ? <span>￥{group.total}</span> : <span></span> }
              </span>
          })}
          </span>
        </Header>
        
        <div>
        {records.map(r => {
            return <Item key={r.createdAt}>
               
              <div className="tags oneLine">

                {r.tagIds
                  .map(tagId => <span key={tagId}>{getName(tagId)}</span>)
                  .reduce((result, span, index, array) =>
                    result.concat(index < array.length - 1 ? [span, '，'] : [span]), [] as ReactNode[])
                }
              </div>
              {r.note && <div className="note">
                {r.note}
              </div>}
              <div className="amount">
                ￥{r.amount}
              </div>
            </Item>;
          })}
        </div>

      </div>)}
    </Layout>
  );
}


export default Statistics;
