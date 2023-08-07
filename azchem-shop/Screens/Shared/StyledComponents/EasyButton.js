import styled, { css } from "styled-components";

const EasyButton = styled.TouchableOpacity`
  flex-direction: row;
  border-radius: 20px;
  padding: 10px;
  margin: 5px;
  justify-content: center;
  background: transparent;

  ${(props) =>
    props.primary &&
    css`
      background: #1f8b0d;
    `}

  ${(props) =>
    props.secondary &&
    css`
      background: #62b1f6;
    `}

    ${(props) =>
    props.danger &&
    css`
      background: #f40105;
    `}

    ${(props) =>
    props.dark &&
    css`
      background: #fff;
      shadowColor: "#fff";
      shadowOpacity: 0.5;
      shadowOffset: 0px 5px;
      shadowRadius: 3.84;
      elevation: 5;
      `}

    ${(props) =>
    props.large &&
    css`
      width: 135px;
    `}

    ${(props) =>
    props.medium &&
    css`
      width: 100px;
    `}

    ${(props) =>
    props.small &&
    css`
      width: 40px;
    `}
`;

export default EasyButton;
