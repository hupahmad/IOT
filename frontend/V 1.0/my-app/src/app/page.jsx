"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useState , useEffect } from "react";

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

export default function Home() {
  let url = "";

  const [butn, setButn] = useState(conn);
  const [subTopic, setSubTopic] = useState("");
  const [pubTopic, setPubTopic] = useState("");


  const [subMessage, setSubMessage] = useState("");
  const [pubMessage, setPubMessage] = useState("");

  function toggleConnection() {
    if (butn === conn) {
      client = mqtt.connect(url);
      
      client.on("connect", () => {
        setButn(disconn);
        console.log("connected");
      });
      client.on("message", (topic, message) => {
        console.log(subMessage);
        setSubMessage((prv) => {return prv + message.toString() + '\n'});
      });
    } else {
      client.end();
      setButn(conn);
      setSubMessage("");
    }
  }

  function publish() {
    client.publish(pubTopic, pubMessage);
  }
  function subscribe() {
    client.subscribe(subTopic , (err) => {
      if (err) {
        console.log(err);
      }
    });

    console.log("subscribe");
  }

  return (
    <>
      <div className={styles.box}>
        <h1 className={styles.title}>Home1</h1>
        <input
          style={{width:"300px", marginLeft:"auto", marginRight:"auto"}}
          className={styles.input}
          type="text"
          onChange={(evt) => {
            url = evt.target.value;
          }}
          placeholder="URL"
        />
        <button
          className={`${styles.btn} ${butn.css}`}
          onClick={toggleConnection}
        >
          {butn.title}
        </button>
      </div>

      <div className={styles.box}>
        <div className={styles.topic}>
          <input
            placeholder="Topic"
            className={styles.input}
            type="text"
            onChange={(evt) => {
              setSubTopic(evt.target.value);
            }}
          />
          <button className={`${styles.btn}`} onClick={subscribe}>
            Subscribe
          </button>
        </div>
        <div className={`${styles.input} ${styles.message}`} type="text" >
          {subMessage}
        </div>
      </div>


      <div className={styles.box}>
        <div className={styles.topic}>
          <input
            placeholder="Topic"
            className={styles.input}
            type="text"
            onChange={(evt) => {
              setPubTopic(evt.target.value);
            }}
          />
          <button className={`${styles.btn}`} onClick={publish}>
            Publish
          </button>
        </div>
        <textarea
          placeholder="Message"
          className={`${styles.input} ${styles.message}`}
          type="text"
          onChange={(evt) => {
            setPubMessage(evt.target.value);
          }}
        />
      </div>
    </>
  );
}
