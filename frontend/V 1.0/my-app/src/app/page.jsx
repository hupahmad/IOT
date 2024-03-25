"use client";
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
//import logo from "@/../public/icon/icons8-delete.svg";

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

  const [subMessage, setSubMessage] = useState("");
  const [pubMessage, setPubMessage] = useState("");

  const [btnList, setbtnList] = useState({});
  const [btnArry, setbtnArry] = useState([]);

  const [deleted, setDeleted] = useState("");

  async function Delete(id) {
    console.log(id);
    let resp = "";
    await fetch("http://147.135.51.66:1111/delete", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    }).then(async function (a) {
      await a.text().then((t) => {
        resp = t;
      });
    });
    setDeleted(id);
  }

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
  }, [deleted]);
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
        {btnArry.map((btn, index) => {
          return (
            <div key={btn} id={btn} className={styles.btnbordar}>
              <h3>{btnList[btn].panelName}</h3>
              <img
                onClick={() => {
                  Delete(btn);
                }}
                className={styles.icon}
                src={"icon/icons8-delete.svg"}
                alt=""
              />
              <div className={styles.checkboxwrapper}>
                <input
                  type="checkbox"
                  id={index}
                  className={`${styles.tgl} ${styles.tglskewed}`}
                />
                <label
                  for={index}
                  data-tg-on="ON"
                  data-tg-off="OFF"
                  className={styles.tglbtn}
                ></label>
              </div>
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
