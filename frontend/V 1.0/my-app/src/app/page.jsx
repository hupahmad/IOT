"use client";
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";

import mqtt from "mqtt";
// ws://192.168.0.34:9001

const conn = {
  title: "CONNECT",
  css: styles.connect,
};
const disconn = {
  title: "DISCONNECT",
  css: styles.disconnect,
};
let client;

function subscribe() {
  client.subscribe(subTopic, (err) => {
    if (err) {
      console.log(err);
    }
  });
}

function check(para) {
  if (para.checked == true) {
    console.log("checked");
    client.publish("home/1", "led on");
  } else {
    console.log("unchecked");
    client.publish("home/1", "led off");
  }
}
async function buttons() {
  let res;
  await fetch("http://147.135.51.66:1111/buttons", {
    method: "GET",
  }).then(async function (resp) {
    await resp.text().then((text) => {
      res = JSON.parse(text);
    });
  });
  return res;
}
export default function Home() {
  let url = "ws://147.135.51.66:9001";

  const [butn, setButn] = useState(conn);
  const [subTopic, setSubTopic] = useState("");
  const [pubTopic, setPubTopic] = useState("");

  const [subMessage, setSubMessage] = useState("");
  const [pubMessage, setPubMessage] = useState("");

  const [btnList, setbtnList] = useState({});
  const [btnArry, setbtnArry] = useState([]);

  function toggleConnection() {
    if (butn === conn) {
      client = mqtt.connect(url);

      client.on("connect", () => {
        setButn(disconn);
        console.log("connected");
      });
      client.on("message", (topic, message) => {
        console.log(subMessage);
        setSubMessage((prv) => {
          return prv + message.toString() + "\n";
        });
      });
    } else {
      client.end();
      setButn(conn);
      setSubMessage("");
    }
  }
  useEffect(() => {
    async function a() {
      const e = await buttons();
      setbtnList(e);
      setbtnArry(Object.keys(e));
      console.log(e);
      console.log(btnArry);
    }
    a();
  }, []);
  return (
    <div className={styles.continer}>
      <div className={styles.box}>
        <h1 className={styles.title}>Home1</h1>
        <button
          className={`${styles.btn} ${butn.css}`}
          onClick={toggleConnection}
        >
          {butn.title}
          {console.log(butn.title)}
        </button>
      </div>

      <div className={styles.buttons}>
        {btnArry.map((btn) => {
          return (
            <div key={btn} id={btn} className="m-[20px] inline-flex ">
              <h3>{btnList[btn].panelName}</h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  className="sr-only peer"
                  value=""
                  type="checkbox"
                  onChange={(e) => {
                    check(e.target);
                  }}
                />
                <div
                  className="peer rounded-br-2xl rounded-tl-2xl outline-none duration-100 after:duration-500 w-28 h-14 bg-blue-300 
              peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500 
              after:content-['OFF'] after:absolute after:outline-none after:rounded-br-xl after:rounded-tl-xl after:h-12 after:w-12 after:bg-white after:top-1 after:left-1 after:flex 
              after:justify-center after:items-center  after:text-sky-800 after:font-bold peer-checked:after:translate-x-14 peer-checked:after:content-['ON'] peer-checked:after:border-white"
                ></div>
              </label>
            </div>
          );
        })}
      </div>

      <div className={styles.divbtn}>
        <Link href="/Add-Button" className={styles.link}>
          +
        </Link>
      </div>
    </div>
  );
}
