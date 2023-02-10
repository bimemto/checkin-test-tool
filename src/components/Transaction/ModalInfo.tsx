/* eslint-disable no-unused-vars */
import CustomModal from '@components/customAntd/Modal';
import { Tabs, Image, Descriptions, Space } from 'antd';
import { useThemeSwitcher } from 'react-css-theme-switcher';
import ReactJson from 'react-json-view';

type IProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  detailTrans: any;
  onlyRow?: boolean;
};

const ModalInfo = ({ isOpen, setIsOpen, detailTrans, onlyRow }: IProps) => {
  const { currentTheme } = useThemeSwitcher();
  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <CustomModal
      title="Chi tiết giao dịch"
      open={isOpen}
      onCancel={handleCancel}
      width={1000}
    >
      <Space direction="vertical" size="large">
        <Tabs defaultActiveKey="preview-req">
          {!onlyRow && (
            <Tabs.TabPane tab="Yêu cầu gửi lên" key="preview-req">
              <Descriptions bordered>
                {detailTrans?.request &&
                  Object.keys(detailTrans?.request)?.map((key) => (
                    <Descriptions.Item key={key} label={key} span={3}>
                      {key === 'front' || key === 'back' || key === 'face' ? (
                        <Image
                          width={200}
                          height={124}
                          alt="img"
                          src={detailTrans?.request[key]}
                        />
                      ) : key === 'video' ? (
                        <video width="240" height="320" controls>
                          <source
                            src={detailTrans?.request[key]}
                            type="video/mp4"
                          />
                        </video>
                      ) : (
                        <>{detailTrans?.request[key]}</>
                      )}
                    </Descriptions.Item>
                  ))}
              </Descriptions>
            </Tabs.TabPane>
          )}
          <Tabs.TabPane tab="Raw data" key="raw-req">
            {detailTrans?.request && (
              <ReactJson
                style={{ overflow: 'auto' }}
                displayObjectSize={false}
                name={false}
                displayDataTypes={false}
                src={detailTrans?.request}
                theme={currentTheme === 'dark' ? 'pop' : 'rjv-default'}
              />
            )}
          </Tabs.TabPane>
        </Tabs>
        <Tabs defaultActiveKey="preview-res">
          {!onlyRow && (
            <Tabs.TabPane tab="Kết quả trả về" key="preview-res">
              {detailTrans?.response?.front && (
                <Descriptions title="Thông tin mặt trước" bordered>
                  {Object.keys(detailTrans?.response?.front)?.map((key) => (
                    <Descriptions.Item key={key} label={key} span={3}>
                      {typeof detailTrans?.response?.front[key] !== 'boolean'
                        ? detailTrans?.response?.front[key]
                        : new Boolean(
                            detailTrans?.response?.front[key]
                          ).toString()}
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              )}
              <br />
              {detailTrans?.response?.back && (
                <Descriptions title="Thông tin mặt sau" bordered>
                  {Object.keys(detailTrans?.response?.back)?.map((key) => (
                    <Descriptions.Item key={key} label={key} span={3}>
                      {typeof detailTrans?.response?.back[key] !== 'boolean'
                        ? detailTrans?.response?.back[key]
                        : new Boolean(detailTrans?.response?.back).toString()}
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              )}
              {detailTrans?.response &&
                (!detailTrans?.response?.back ||
                  !detailTrans?.response?.front) && (
                  <Descriptions bordered>
                    {Object.keys(detailTrans?.response)?.map((key) => (
                      <Descriptions.Item key={key} label={key} span={3}>
                        {typeof detailTrans?.response[key] !== 'boolean'
                          ? detailTrans?.response[key]
                          : new Boolean(detailTrans?.response).toString()}
                      </Descriptions.Item>
                    ))}
                  </Descriptions>
                )}
            </Tabs.TabPane>
          )}
          <Tabs.TabPane tab="Raw data" key="raw-res">
            {detailTrans?.response && (
              <ReactJson
                style={{ overflow: 'auto' }}
                displayObjectSize={false}
                name={false}
                displayDataTypes={false}
                src={detailTrans?.response}
                theme={currentTheme === 'dark' ? 'pop' : 'rjv-default'}
              />
            )}
          </Tabs.TabPane>
        </Tabs>
      </Space>
    </CustomModal>
  );
};

export default ModalInfo;
