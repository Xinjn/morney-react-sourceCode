import styled from 'styled-components';
import React, {ChangeEventHandler} from 'react';
import { Input } from 'components/Input';

const Wrapper = styled.section`
  background: #f5f5f5;
  padding: 0px 16px;
  font-size: 14px;
  }
`;

type Props = {
  value: string;
  onChange: (value: string) => void;
  
}
const CreatedAtSection: React.FC<Props> = (props) => {
  const note = props.value

  const onChange:ChangeEventHandler<HTMLInputElement>= (e) => {
    props.onChange(e.target.value)
  };
  return (
    <Wrapper>
      <Input label='时间' type="date" value={note} onChange={onChange} placeholder="请填写时间">
      </Input>
    </Wrapper>
  );
};

export {CreatedAtSection};

