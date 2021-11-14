import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { ColorContext } from "../ContextProviders/ColorContext";
import jwtDecode from "jwt-decode";

import practiceMonster from "../Images/MonsterImages/MonsterBasic.png";

import RibbonBar from "../Components/RibbonBar";

function MonsterPage() {
  // this is used to force user navigation between pages
  const navigate = useNavigate();
  const theme = useContext(ColorContext);
  const [loading, setLoading] = useState(true);

  // this is how we determine if the user is logged in or not. Syntax may need to become asynchronous if loading times become an issue.

  const pageTargets = ["/AccountPage", "/WorkoutLogPage", "/PastWorkoutsPage"];
  const pageTitles = [
    "Your Account Info",
    "Daily Workout Log",
    "Your Past Workouts",
  ];

  useEffect(() => {
    let token = jwtDecode(localStorage.getItem("id_token"));
    if (token === undefined || token === null) {
      // we want to not change this if the thing is
      // I think this means that if they don't have a token it will just force them to infinitely load wait, but I will have to solve that problem later
    } else {
      if (token.exp * 1000 > Date.now()) {
        const monsterFetch = {
          method: "GET",
          headers: JSON.stringify({
            "Content-Type": "application/json",
            user_token: token,
          }),
        };
        // now we know that the token is still valid,
        // so we do a fetch to the backend
        fetch("/example_endpoint", monsterFetch)
          .then((response) => {
            if (response.status !== 201) {
              navigate("/signin");
              throw new Error(response.status);
            } else {
              return response.json();
            }
          })
          .then((data) => console.log(data));
      } else {
        navigate("/signin");
      }
    }
  }, []);

  if (loading) {
    // this upper div is returned to the user and rendered until the loading is finished
    return (
      <LoadingWrapper theme={theme}>
        <LoadingText theme={theme}>
          <LoadingTextWrapper theme={theme}>Loading...</LoadingTextWrapper>
        </LoadingText>
      </LoadingWrapper>
    );
  } else {
    return (
      <Body theme={theme}>
        <RibbonBar pageTargets={pageTargets} pageTitles={pageTitles} />
        <MonsterPageWrapper>
          <XPBar>
            <XPSlider></XPSlider>
          </XPBar>
          <MonsterNameWrapper>
            <MonsterName>Klokov</MonsterName>
          </MonsterNameWrapper>
          <MonsterImageWrapper
            monsterImage={practiceMonster}
          ></MonsterImageWrapper>
          <BottomContentWrapper>
            <MonsterInfo>
              Here we have all the information about the workout fiend. We might
              even have some information about your workout today. Possibly a
              daily workout tip or something like that. This can all be easily
              injected. currently I'm just filling this with what is basically a
              lorem ipsum
            </MonsterInfo>
          </BottomContentWrapper>
        </MonsterPageWrapper>
      </Body>
    );
  }
}

export default MonsterPage;

const Body = styled.div`
  background-color: ${(props) => props.theme.primaryBackground};
  color: ${(props) => props.theme.primaryText};
  height: 100vh;
  width: 100vw;
`;

const MonsterPageWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const XPBar = styled.div`
  border: solid black 4px;
  border-radius: 12px;
  height: min(10vh, 40px);
  width: min(98%, 700px);
`;

const XPSlider = styled.div`
  height: 100%;
  width: 40%;
  background-color: green;
  border-radius: 12px;
`;

const MonsterNameWrapper = styled.div`
  width: min(98%, 600px);
  flex-grow: 0.1;
  display: flex;
  flex-direction: row-reverse;
`;

const MonsterName = styled.h2`
  margin-right: 10%;
  width: 20%;
  line-height: 100%;
`;

const MonsterImageWrapper = styled.div`
  background: url(${(props) => props.monsterImage});
  background-size: cover;
  background-position: center;
  width: min(80vw, 500px);
  height: min(80vw, 500px);
  border-radius: 20px;
  box-shadow: 0px 3px 12px black;
`;

const BottomContentWrapper = styled.div`
  width: min(100%, 800px);
  flex-grow: 2;
  text-align: center;
  text-justify: center;
`;

const MonsterInfo = styled.p`
  font-size: max(2.5vmin, 14pt);
  padding-left: 20px;
  padding-right: 20px;
`;

const LoadingWrapper = styled.div`
  background-color: ${(props) => props.theme.primaryBackground};
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
`;

const LoadingTextWrapper = styled.div`
  background-color: ${(props) => props.theme.secondaryBackground};
  display: flex;
  justify-content: center;
  align-items: center;
  width: max(20vw, 200px);
  height: 10vh;
  border-radius: 20px;
  box-shadow: -4px 4px 14px black;
`;

const LoadingText = styled.h1`
  color: ${(props) => props.theme.primaryText};
  font-weight: bolder;
  text-align: center;
`;
