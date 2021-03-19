import React, { DOMAttributes, FormEvent } from "react";
import styled from "styled-components";
import { data as _data } from "../data";

type DataProps = {
  id: number;
  name: string;
  cost: number;
  created_at: string;
};

type ModalProps = {
  visible: boolean;
};

const Container = styled.div`
  border: 1px solid white;
  width: 200px;
  padding: 8px;
  margin: 8px;
  box-shadow: 1px 1px 5px 0px #ffffff90;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-top: 1px solid #cecece80;
  padding: 8px 0 8px 8px;
`;

const Item = styled.div`
  font-size: 12px;
`;

const DateLabel = styled.div`
  display: flex;
  align-items: flex-start;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const TotalContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  border-top: 2px solid #cecece;
  padding: 8px 0;
`;

const TotalLabel = styled.div`
  font-weight: bold;
  font-size: 12px;
  margin-right: 16px;
`;

const TotalCost = styled.div`
  font-weight: bold;
  font-size: 12px;
`;

const getDate = (date: Date) => {
  const MONTHS = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "June",
    "July",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  return (
    date.getDate() + " " + MONTHS[date.getMonth()] + " " + date.getFullYear()
  );
};

const getTime = (date: Date) => {
  const hour = date.getHours();
  const minutes = date.getMinutes();

  return (
    (hour < 10 ? "0" + hour : hour) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes)
  );
};

const formatMoney = (value: number) => {
  return "Rp " + value.toLocaleString("de-DE");
};

function groupBy(list: any[], keyGetter: (props: any) => {}) {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

function Grid({
  data,
  callback,
}: {
  data: DataProps[];
  callback: (props: number) => void;
}) {
  let totalCost = 0;
  const dataGroupBy = groupBy(data, (item) => {
    const date = new Date(item.created_at);
    return getDate(date);
  });

  const dataToPrint = Array.from(dataGroupBy, ([date, item]) => ({
    date,
    item,
  }));

  const result = dataToPrint.map((groupItem, index) => {
    let totalCostPerDate = 0;
    return (
      <Container key={index.toString()}>
        <DateLabel>
          {groupItem.date.substr(0, groupItem.date.lastIndexOf(" "))}
        </DateLabel>

        {groupItem.item.map((shopItem: any, index: number) => {
          const date = new Date(shopItem.created_at);
          totalCostPerDate += shopItem.cost;
          totalCost += shopItem.cost;
          return (
            <Content key={index.toString()}>
              <Item>{getTime(date) + " " + shopItem.name}</Item>
              <Item>{formatMoney(shopItem.cost)}</Item>
            </Content>
          );
        })}
        <TotalContainer>
          <TotalLabel>Total</TotalLabel>
          <TotalCost>{formatMoney(totalCostPerDate)}</TotalCost>
        </TotalContainer>
      </Container>
    );
  });

  callback(totalCost);
  return <Row>{result}</Row>;
}

const Title = styled.div`
  font-size: 24px;
  font-weight: bold;
`;

const Subtitle = styled.div`
  font-size: 20px;
`;

const ButtonAddItem = styled.button`
  margin: 16px;
  color: black;
`;

const Modal = styled.div<ModalProps>`
  display: ${(props) => (props.visible ? "block" : "none")};
  width: 100%;
  height: 100%;
  background: #cecece80;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
`;

const ContentAddItem = styled.div`
  background: white;
  width: 300px;
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
`;

const ContainerAddItem = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  padding: 8px;
`;
const TitleAddItem = styled.div`
  font-size: 16px;
  color: black;
  margin-bottom: 8px;
`;
const SubtitleAddItem = styled.div`
  font-size: 12px;
  color: black;
  margin-bottom: 4px;
`;
const InputAddItem = styled.input`
  color: black;
  margin-bottom: 8px;
`;

const ButtonBatal = styled.button`
  margin-right: 8px;
`;
const ButtonKirim = styled.button``;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

const dateToFormattedString = (date: Date) => {
  return (
    date.getFullYear() +
    "-" +
    date.getMonth() +
    "-" +
    date.getDate() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds()
  );
};

function ExpenseScreen() {
  let callbackResult = 0;
  const [dataExpense, setDataExpense] = React.useState<DataProps[]>(_data);
  const [totalExpense, setTotalExpense] = React.useState(0);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [itemName, setItemName] = React.useState<string>("");
  const [itemCost, setItemCost] = React.useState<number>(0);

  React.useEffect(() => {
    setTotalExpense(callbackResult);
  }, [callbackResult, dataExpense]);

  const onClickAddItem = () => {
    setIsModalVisible(!isModalVisible);
  };

  const onCancelAddItem = () => {
    setIsModalVisible(!isModalVisible);
  };

  const onConfirmAddItem = () => {
    setDataExpense((prevState: DataProps[]) => {
      const currentDate = new Date();
      const newItem: DataProps = {
        id: prevState[prevState.length].id,
        name: itemName,
        cost: itemCost,
        created_at: dateToFormattedString(currentDate),
      };
      return [...prevState, newItem];
    });
    setItemName("");
    setItemCost(0);
    setIsModalVisible(!isModalVisible);
  };

  return (
    <div>
      <Title>Diari Jajan</Title>
      <Subtitle>Pengeluaran Bulan ini {formatMoney(totalExpense)}</Subtitle>
      <ButtonAddItem onClick={onClickAddItem}>Tambah Item</ButtonAddItem>
      <Grid
        data={dataExpense}
        callback={(result) => {
          callbackResult = result;
        }}
      />
      <Modal visible={isModalVisible}>
        <ContentAddItem>
          <ContainerAddItem>
            <TitleAddItem>Tambah Entri</TitleAddItem>
            <SubtitleAddItem>Nama</SubtitleAddItem>
            <InputAddItem
              placeholder={"nama"}
              onChange={(evt) => setItemName(evt.target.value)}
            ></InputAddItem>
            <SubtitleAddItem>Harga</SubtitleAddItem>
            <InputAddItem
              placeholder={"cost"}
              onChange={(evt) => setItemCost(parseInt(evt.target.value))}
            ></InputAddItem>
            <div></div>
            <ButtonWrapper>
              <ButtonBatal onClick={onCancelAddItem}>BATAL</ButtonBatal>
              <ButtonKirim onClick={onConfirmAddItem}>KIRIM</ButtonKirim>
            </ButtonWrapper>
          </ContainerAddItem>
        </ContentAddItem>
      </Modal>
    </div>
  );
}

ExpenseScreen.propTypes = {};

export default ExpenseScreen;
