import { Empty } from "antd";
const DetailThingComponent = (props) => {
  const { data } = props;

  return (
    <table style={{ width: "-webkit-fill-available" }}>
      <tbody>
        {!!data ? (
          data.length > 0 ? (
            data.map((item, index) => (
              <tr
                key={
                  item["lab_order_number"] + item["specimen_name"].toString()
                }
              >
                <td>{`${index + 1}. ${item["specimen_name"]}`}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td>
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              </td>
            </tr>
          )
        ) : (
          <></>
        )}
      </tbody>
    </table>
  );
};

export default DetailThingComponent;
