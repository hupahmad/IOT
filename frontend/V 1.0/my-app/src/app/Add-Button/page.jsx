"use client";

import Link from "next/link";
import styles from "./page.module.css";
import React, { useState } from "react";

// 147.135.51.66:1111/create

export default function AddButton() {
  const [pan, setpan] = useState("");
  const [top, settop] = useState("");
  const [pay, setpay] = useState("");

  async function create() {
    if (pan != "" && top != "" && pay != "") {
      let resp = "";
      await fetch("http://147.135.51.66:1111/create", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ panelName: pan, topic: top, payload: pay }),
      })
        .then(async function (a) {
          await a.text().then((t) => {
            resp = t;
          });
        })
        .then(() => {
          if (resp === "ok") {
            window.location.href = "/";
            console.log("create");
          } else {
            console.log("error");
          }
        });
    } else {
      console.log("error");
    }
  }

  return (
    <div className={styles.continer}>
      <div className={styles.formBox}>
        <form className={styles.form}>
          <span className={styles.title}>CREATE</span>
          <span className={styles.subtitle}>Add a Button panel.</span>
          <div className={styles.formcontainer}>
            <input
              type="text"
              className={styles.input}
              placeholder="Panel name*"
              onChange={(e) => {
                setpan(e.target.value);
              }}
            />
            <form className={styles.form} action="/action_page.php">
              <label for="cars">Select:</label>
              <select name="cars" id="cars">
                <option value="Port 1">Port 1</option>
                <option value="Port 2">Port 2</option>
                <option value="Port 3">Port 3</option>
                <option value="Port 4">Port 4</option>
                <option value="LED 1">LED 1</option>
                <option value="LED 2">LED 2</option>
                <option value="LED 3">LED 3</option>
              </select>
              <br></br>
            </form>
          </div>
          <div onClick={create} className={styles.btn}>
            CREATE
          </div>
          <Link href="/" className={styles.Cancel}>
            CANCEL
          </Link>
        </form>
      </div>
    </div>
  );
}
