import React from 'react';

const Login = () => {
  return (
    <div style={{width: "100vw", flexDirection:"column", textAlign: "center"}}>
      <div style={{width: "100vw", height: "60px", padding: "0", margin: "0", top: "0"}}><img style={{width: "5%", aspectRatio: "9/5", top: "10px"}} src="/imgs/nav_logo.png" /></div>
      <div style={{width: "100vw", height: "100vh", backgroundColor: "#f2f2f2", top: "0", margin: "0px"}}>
        <p style={{margin: "0", paddingTop: "100px", fontFamily: "Roboto", color: "#000000", fontSize: "64px", fontWeight: "500"}}>로그인</p>
        <button style={{marginTop: "110px", width: "20%", aspectRatio: "4/1", fontFamily: "Roboto", color: "#ffffff", backgroundColor: "#555555", fontSize: "18px", fontWeight: "500"}}>Github로 로그인</button>
        <br />
        <button style={{marginTop: "10px", width: "20%", aspectRatio: "8/1", fontFamily: "Roboto", color: "#ffffff", backgroundColor: "#959595", fontSize: "18px", fontWeight: "500"}}>고객 센터</button>
        <br />
        <p style={{margin: "0", paddingTop: "35vh", fontFamily: "Roboto", color: "#000000", fontSize: "14px", fontWeight: "100"}}>© 2023 -    Privacy — Terms</p>
      </div>
    </div>
  );
};

export default Login;
