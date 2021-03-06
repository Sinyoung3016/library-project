import React, { ReactNode, useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import axios from 'axios';
import { useLoginState } from 'contexts/LoginContext';
import Book from './book/Book';

interface Props {
  isbn: number;
  title: string;
  author: string;
  publisher: string;
  year: string;
  cno?: number; // eslint-disable-line
  extTimes?: number; // eslint-disable-line
  dateRented?: string; // eslint-disable-line
  dateDue?: string; // eslint-disable-line
  getEbook: () => void;
}

interface BProps {
  dateDue?: string;
}

const DateRented = styled.td<BProps>`
  background-color: ${(props) => (props.dateDue ? '#FFD8DF' : '#f0f0f8')};
  height: 30px;
  margin: 0 0 0 10px;
  width: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const DateReturn = styled.td<BProps>`
  background-color: ${(props) => (props.dateDue ? '#FFD8DF' : '#f0f0f8')};
  height: 30px;
  margin: 0 0 0 10px;
  width: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ExtTime = styled.td<BProps>`
  background-color: ${(props) => (props.dateDue ? '#FFD8DF' : '#f0f0f8')};
  &:hover {
    background-color: ${(props) => (props.dateDue ? '#FF8888' : '#f0f0f8')};
  }
  height: 30px;
  margin: 0 0 0 10px;
  width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const BtnExtTime = styled.td<BProps>`
  background-color: ${(props) => (props.dateDue ? '#f0f0f8' : '#FFD8DF')};
  &:hover {
   background-color: ${(props) => (props.dateDue ? '#f0f0f8' : '#FF8888')};
  }
  height: 30px;
  margin: 0 0 0 10px;
  width: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Return = styled.td<BProps>`
  background-color: ${(props) => (props.dateDue ? '#f0f0f8' : '#FFD8DF')};
  &:hover {
    background-color: ${(props) => (props.dateDue ? '#f0f0f8' : '#FF8888')};
  }
  height: 30px;
  margin: 0 0 0 10px;
  width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`
  
const Container = styled.tr`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
  
const MyBookBook = ({isbn, title, author, publisher, year, cno, extTimes, dateRented, dateDue, getEbook} : Props) => {  
  const loginState = useLoginState();

  // ?????? ?????? ?????? ??????
  const onClickReturn = async () => {
    const today = moment().format('YYYYMMDD');
    const currentCno = loginState.cno; //eslint-disable-line
    if(currentCno !== 0 && !currentCno) {
      alert('## ????????? ??????');
      return;
    }
    const response = await axios.post('/api/return', {
      data: {
        dateReturned: today,
        cno,
        isbn,
      }
    });
    getEbook();
    alert('?????? ?????? ??????????????????.');
  }

  // ?????? ?????? ?????? ?????? ??????
  const onClickExtend = async () => {
    let isReserved = false;
    const currentCno = loginState.cno; //eslint-disable-line
    if(currentCno !== 0 && !currentCno) {
      alert('## ????????? ??????');
    }

    // ?????? ????????? ????????? ?????????, ?????? ??????
    const { data } = await axios.get('/api/isThereReserve');
    data.map((i: any) => {
      if(i[0] === isbn) {    
        isReserved = true;
      }
    })

    if(isReserved) {
      alert('????????? ??????????????? ????????? ???????????????.');
      return;
    }
    
    // ?????? ?????? ????????? ?????? ??? ???
    if (extTimes || extTimes === 0) {
      if (extTimes >= 2) {
        alert('????????? ?????? 2????????? ???????????????.');
        return;
      }
    
    const extendDate =  moment(dateDue).add(10, 'd').format('YYYYMMDD');
    const response = await axios.post('/api/extendtime', {
      data: {
        isbn,
        extendDate,
        extendTimes: extTimes,
      }
    });
  }
    getEbook();
    alert('?????? ????????? ?????? ????????? ??????????????????.');
  }

  return (
    <Container>   
      <Book isbn={isbn} title={title} author={author} publisher={publisher} year={year} />
      <DateRented>{dateRented}</DateRented>
      <DateReturn>{dateDue}</DateReturn>
      <ExtTime>{extTimes}</ExtTime>
      <BtnExtTime onClick={onClickExtend}>EXTEND TIMES</BtnExtTime>
      <Return onClick={onClickReturn}>RETURN</Return>
    </Container>
  );
};

export default MyBookBook;
