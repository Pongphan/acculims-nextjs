import { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "antd";
const { TextArea } = Input;
const DetailNoteComponent = (props) => {
  const { data, api, summitNote } = props;
  const [note, setNote] = useState("");
  const inputNote = (event) => {
    setNote(event.target.value);
  };
  useEffect(() => {
    setNote(!!data ? data["order_note"] : "");
  }, [data]);
  const commitNote = (event) => {
    summitNote(data["lab_order_number"], note);
  };
  return (
    <table style={{ width: "-webkit-fill-available" }}>
      <tbody>
        <tr>
          <td>
            <TextArea
              onChange={inputNote}
              onKeyUp={commitNote}
              // rows={4}
              autoSize={{
                minRows: 4,
                maxRows: 6,
              }}
              value={note}
              placeholder={"ไม่มีข้อความบันทึก"}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default DetailNoteComponent;
