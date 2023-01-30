import { React, useEffect, useState } from "react";
import { Empty, Input } from "antd";

const LabOrderPrintComponent = (props) => {
  const { data, detail } = props;
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    setDataList(data);
  }, [data]);

  return detail ? (
    <>
      <table
        style={{
          width: "100%",
          overflowX: "auto",
          whiteSpace: "nowrap",
          borderCollapse: "collapse",
          fontSize: "90%",
        }}
      >
        <tbody>
          <tr>
            <td style={{ width: "30%" }}>
              <p>
                <b>NAME</b> : {detail["name"]}
              </p>
            </td>
            <td style={{ width: "40%" }}>
              <p>
                <b>HN</b> : {detail["hn"]} <b>SEX</b> : {detail["SEX"]}{" "}
                <b>AGE</b> : {detail["year"]} ปี {detail["month"]} เดือน{" "}
              </p>
            </td>
            <td style={{ width: "30%", textAlign: "right" }}>
              <p>
                <b>จุดที่สั่ง</b> : {detail["wardname"]}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
      <table
        style={{
          width: "100%",
          overflowX: "auto",
          whiteSpace: "nowrap",
          borderCollapse: "collapse",
          fontSize: "90%",
        }}
      >
        <tbody>
          <tr
            style={{
              borderBottom: "1px solid #000",
              borderTop: "1px solid #000",
              textAlign: "left",
            }}
          >
            <th style={{ width: "25%" }}>Test Name</th>
            <th style={{ width: "15%" }}>Result</th>
            <th style={{ width: "10%" }}></th>
            <th style={{ width: "15%" }}>Unit</th>
            <th style={{ width: "20%" }}>Normal Range</th>
            <th style={{ width: "20%" }}>Last Result</th>
          </tr>
        </tbody>
        <tbody>
          {dataList.length > 0 ? (
            dataList.map((item, index) => {
              let text;

              if (
                index === 0 ||
                dataList[index].sub_code !== dataList[index - 1].sub_code
              ) {
                if (dataList[index].sub_code !== null) {
                  text = (
                    <tr
                      key={
                        item["lab_items_sub_group_name"].toString() +
                        item["lab_items_name"].toString()
                      }
                      style={{ borderBottom: "1px solid #f0f0f0" }}
                    >
                      <td colSpan={11}>{item["lab_items_sub_group_name"]}</td>
                    </tr>
                  );
                } else {
                  text = null;
                }
              } else {
                text = null;
              }

              return (
                <>
                  {text}
                  <tr
                    key={item["lab_items_name"].toString()}
                    style={{ borderBottom: "1px solid #f0f0f0" }}
                  >
                    <td>
                      {item["lab_items_sub_group_name"] !== null ? (
                        <span style={{ paddingLeft: "15px" }}>
                          {item["lab_items_name"]}
                        </span>
                      ) : (
                        <>{item["lab_items_name"]}</>
                      )}
                    </td>
                    <td>
                      {item["lab_order_result_manual"]
                        ? item["lab_order_result_manual"]
                        : item["lab_order_result_instrument"]}
                    </td>
                    <td>
                      <b>{item["flag"]}</b>
                    </td>
                    <td>{item["lab_items_unit"]}</td>
                    <td>{item["lab_items_normal_value"]}</td>
                    <td>
                      {!!item["history"] && item["history"].length > 0
                        ? !!item["history"]["lab_order_result"]
                          ? item["history"]["lab_order_result"]
                          : item["history"][0]["lab_order_result"]
                        : null}
                    </td>
                  </tr>
                </>
              );
            })
          ) : (
            <tr>
              <td colSpan={11}>
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              </td>
            </tr>
          )}
          <tr
            style={{
              borderBottom: "1px solid #000",
            }}
          ></tr>
        </tbody>
      </table>
      <table
        style={{
          width: "100%",
          whiteSpace: "nowrap",
          borderCollapse: "collapse",
          fontSize: "90%",
        }}
      >
        <tbody>
          <tr>
            <td style={{ width: "40%", verticalAlign: "top" }}>
              <p style={{ marginBottom: 0 }}>
                <b>Received date</b> : {detail["receive_date"]}
              </p>
              <p style={{ margin: 0 }}>
                <b>Reported date</b> : {detail["report_date"]}
              </p>
              <p style={{ margin: 0 }}>
                <b>Approved date</b> : {detail["approved_date"]}
              </p>
              <p style={{ margin: 0 }}>
                <b>Turn around time</b> :{" "}
              </p>
              <p style={{ margin: 0 }}>
                <b>Note</b> : {detail["order_note"]}
              </p>
            </td>
            <td
              style={{
                width: "25%",
                verticalAlign: "top",
              }}
            >
              <div
                style={{
                  border: "1px solid #000",
                  padding: "5px",
                  margin: "5px",
                }}
              >
                <p style={{ margin: 0 }}>
                  <b>L</b> = Low{" "}
                </p>
                <p style={{ margin: 0 }}>
                  <b>H</b> = High{" "}
                </p>
                <p style={{ margin: 0 }}>
                  <b>P</b> = Repeated{" "}
                </p>
              </div>
            </td>
            <td
              style={{
                width: "35%",
                verticalAlign: "top",
                textAlign: "center",
              }}
            >
              <p style={{ marginBottom: 0 }}>
                Reported by : ..................................{" "}
              </p>
              <p style={{ margin: 0 }}>({detail["reporter_name"]})</p>
              <p style={{ marginBottom: 0 }}>
                Approved by : ..................................{" "}
              </p>
              <p style={{ margin: 0 }}>({detail["approver_name"]})</p>
            </td>
          </tr>
          <tr>
            <td colSpan={3} style={{ textAlign: "center" }}>
              * THE ABOVE RESULT REFLECTS THE ANALYSIS ONLY OF THE SAMPLE, IN
              CONDITION RECEIVED *
            </td>
          </tr>
        </tbody>
      </table>
    </>
  ) : (
    <></>
  );
};

export default LabOrderPrintComponent;
