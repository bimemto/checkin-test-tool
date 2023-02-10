import React from 'react';
import { Typography, Space, Button } from 'antd';
import CustomModal from '@components/customAntd/Modal';

const { Text, Paragraph } = Typography;

type Prop = {
  isModalVisibleTerm: boolean;
  handleCancel: () => void;
};

const ModalTerm = ({ isModalVisibleTerm, handleCancel }: Prop) => {
  return (
    <CustomModal
      title="ĐIỀU KHOẢN APPOTAPAY"
      open={isModalVisibleTerm}
      onCancel={handleCancel}
      footer={<Button onClick={handleCancel}>Hủy</Button>}
    >
      <Space direction="vertical" size="middle">
        <Paragraph>
          1. <Text strong>Tổng Quan</Text>
          <Paragraph className="term-content">
            Quy định này được đưa ra dựa trên cơ sở pháp lý và lợi ích của các
            bên. Mọi thành viên, tổ chức hay cá nhân khi tham gia hệ thống
            AppotaPay, bắt buộc phải đọc và hiểu cũng như đồng ý với toàn bộ quy
            định dưới đây.
          </Paragraph>
          <Paragraph className="term-content">
            Hệ thống AppotaPay sẽ mặc định bạn đồng ý mọi điều khoản được nêu ra
            khi bạn đồng ý tham gia vào hệ thống của AppotaPay và ngược lại
            trong trường hợp bạn thấy có điều kiện không phù hợp với mô hình
            kinh doanh của đơn vị mình thì bạn có thể không tham gia hệ thống
            của AppotaPay.
          </Paragraph>
        </Paragraph>
        <Paragraph>
          2. <Text strong>Định Nghĩa</Text>
          <Paragraph className="term-content">
            1. <Text strong>AppotaPay (bên A):</Text> là đơn vị cung cấp giải
            pháp, nền tảng hệ thống thanh toán phục vụ cho các sản phẩm, dịch vụ
            nội dung số do các cá nhân, đơn vị kinh doanh khác cung cấp.
          </Paragraph>
          <Paragraph className="term-content">
            2. <Text strong>Đối tác (bên B):</Text> là tổ chức hay cá nhân tham
            gia vào hệ thống AppotaPay, cung các sản phẩm, dịch vụ nội dung số
            đến người tiêu dùng. Mỗi Đối tác đều được sở hữu 1 tài khoản tại hệ
            thống của AppotaPay.
          </Paragraph>
          <Paragraph className="term-content">
            3. <Text strong>Doanh thu tổng (ký hiệu DT):</Text> là tổng số tiền
            mà người dùng đầu cuối đã chi trả cho dịch vụ ( đã bao gồm 10%
            GTGT).
          </Paragraph>
          <Paragraph className="term-content">
            4. <Text strong>Doanh thu chia sẻ (ký hiệu DTS):</Text> là số tiền
            Đối tác được hưởng, doanh thu này được tính bằng công thức: DTS = DT
            * TLP
          </Paragraph>
          <Paragraph className="term-content">
            5.{' '}
            <Text strong>
              Tỷ lệ phân chia doanh thu Đối tác (ký hiệu TLP):{' '}
            </Text>{' '}
            là tỷ lệ phần trăm phân chia doanh thu mà Đối tác được hưởng, tỉ lệ
            này được đề cập cụ thể trong hợp đồng.
          </Paragraph>
          <Paragraph className="term-content">
            6. <Text strong> Thanh toán:</Text>là chu trình AppotaPay thực hiện
            trả số doanh thu mà Đối tác được hưởng theo như cam kết trong hợp
            đồng.
          </Paragraph>
          <Paragraph className="term-content">
            7. <Text strong>Hạn mức thanh toán: </Text> là doanh thu tối thiểu
            Bên B cần đạt được để làm thủ tục thanh toán. AppotaPay quy định hạn
            mức doanh thu tối thiểu là <Text strong>1.000.000 VNĐ</Text> (Một
            triệu đồng chẵn). Phần doanh thu chưa được thanh toán sẽ được cộng
            dồn vào chu kỳ thanh toán kế tiếp.
          </Paragraph>
          <Paragraph className="term-content">
            8. <Text strong>Thuế giá trị gia tăng (GTGT):</Text> Theo quy định
            hiện hành của Nhà nước Việt Nam.
          </Paragraph>
          <Paragraph className="term-content">
            9. <Text strong>Thuế thu nhập cá nhân (TNCN):</Text> Theo quy định
            hiện hành của Nhà nước Việt Nam.
          </Paragraph>
          <Paragraph className="term-content">
            10. <Text strong>Thuế nhà thầu(TNT):</Text> Theo quy định hiện hành
            của Nhà nước Việt Nam.
          </Paragraph>
        </Paragraph>
        <Paragraph>
          3. <Text strong>Điều kiện mở tài khoản</Text>
          <Paragraph className="term-content">
            1. AppotaPay có quyền lựa chọn nội dung của sản phẩm, trước khi đồng
            ý cho Đối tác tích hợp hệ thống thanh toán vào sản phẩm.
          </Paragraph>
          <Paragraph className="term-content">
            2. Khai báo đầy đủ thông tin theo yêu cầu của AppotaPay một cách
            chính xác và rõ ràng. AppotaPay sẽ luôn kiểm tra lại những thông tin
            này, nhằm đảm bảo thông tin Đối tác đã khai báo có thể được sử dụng
            để: thanh toán, liên hệ, giải quyết khiếu nại...
          </Paragraph>
          <Paragraph className="term-content">
            3. AppotaPay có quyền không chấp nhận mở tài khoản cho những trường
            hợp Đối tác không khai báo rõ ràng, chính xác các thông tin mà
            AppotaPay yêu cầu. AppotaPay có quyền kiểm tra và sử dụng kết quả
            nếu thông tin của Đối tác được thay đổi hay việc phát hiện thông tin
            sai lệch, không rõ ràng trong bất kỳ thời điểm nào để thực hiện khóa
            tài khoản Đối tác và yêu cầu làm rõ.
          </Paragraph>
        </Paragraph>
        <Paragraph>
          4. <Text strong>Điều kiện dành cho sản phẩm phù hợp</Text>
          <Paragraph className="term-content">
            1. AppotaPay có quyền lựa chọn nội dung của sản phẩm, trước khi đồng
            ý cho Đối tác tích hợp hệ thống thanh toán vào sản phẩm.
          </Paragraph>
          <Paragraph className="term-content">
            2. Các Đối tác phải tự chịu trách nhiệm toàn bộ về tính pháp lý, bản
            quyền, giấy phép kinh doanh, chất lượng, nội dung của các Sản phẩm
            số mà Đối tác cung cấp ra thị trường. AppotaPay không có bất kỳ
            trách nhiệm vào liên quan tới các Sản phẩm số này. Các trách nhiệm
            trên bao gồm (nhưng không chỉ giới hạn ở) các điều sau:
            <Paragraph className="term-content">
              1. Cam kết chịu trách nhiệm hoàn toàn trước pháp luật về các hoạt
              động kinh doanh, thương mại, sản phẩm, dịch vụ, giao dịch trực
              tuyến của mình khi sử dụng giải pháp tích hợp thanh toán của
              AppotaPay.
            </Paragraph>
            <Paragraph className="term-content">
              2. Không sử dụng dịch vụ thanh toán trực tuyến của AppotaPay cho
              các Sản phẩm, dịch vụ nội dung số vi phạm bản quyền, không được
              phép của tác giả, vi phạm các quy định về sở hữu trí tuệ.
            </Paragraph>
            <Paragraph className="term-content">
              3. Không đề xướng đến các vấn đề chống lại nhà nước Cộng hòa xã
              hội chủ nghĩa Việt Nam; gây phương hại đến an ninh quốc gia, trật
              tự, an toàn xã hội; phá hoại khối đại đoàn kết toàn dân; tuyên
              truyền chiến tranh xâm lược; gây hận thù, mâu thuẫn giữa các dân
              tộc, sắc tộc, tôn giáo; tuyên truyền, kích động bạo lực, dâm ô,
              đồi trụy, tội ác, tệ nạn xã hội, mê tín dị đoan; phá hoại thuần
              phong, mỹ tục của dân tộc.
            </Paragraph>
            <Paragraph className="term-content">
              4. Không được sử dụng nội dung hoặc dẫn, định hướng người dùng đến
              các trang/kênh thông tin xuyên tạc, vu khống, xúc phạm uy tín của
              tổ chức; danh dự, nhân phẩm của công dân.
            </Paragraph>
            <Paragraph className="term-content">
              5. Không lợi dụng thương hiệu, hình ảnh của AppotaPay để nói xấu,
              bôi nhọ đối thủ cạnh tranh, quảng cáo, tuyên truyền, mua bán hàng
              hóa/dịch vụ thuộc danh mục cấm cũng như thực hiện các hành vi cạnh
              tranh phi đạo đức hay trái với những điều pháp luật quy định.
            </Paragraph>
          </Paragraph>
          <Paragraph className="term-content">
            3. Nếu Đối tác vi phạm một trong các quy định được đề cập trong điều
            1.3, AppotaPay có quyền khóa tài khoản, tạm giữ doanh thu tính đang
            có trong tài khoản cũng như cung cấp các thông tin cần thiết mà
            AppotaPay đang lưu trữ cho cơ quan có thẩm quyền. Trong mọi trường
            hợp, tùy vào mức độ vi phạm của Đối tác, AppotaPay có quyền khóa tạm
            thời hoặc vĩnh viễn tài khoản của Đối tác mà không cần báo trước.
          </Paragraph>
          <Paragraph className="term-content">
            4. Mọi hành vi thu phí trong sản phẩm đều phải được hiển thị rõ
            ràng, với những chức năng nhằm xác thực hành vi người dùng khi thực
            hiện thanh toán. Không chứa các mã nguồn, chức năng thu phí chạy ẩn
            hoặc thực thi mà không có sự đồng ý của người dùng.
          </Paragraph>
        </Paragraph>
        <Paragraph>
          5. <Text strong>Điều kiện để được thanh toán</Text>
          <Paragraph>Đối tác sẽ được thanh toán khi và chỉ khi:</Paragraph>
          <Paragraph className="term-content">
            1. Tham gia hệ thống của AppotaPay.
          </Paragraph>
          <Paragraph className="term-content">
            2. Đạt đủ số dư tối thiểu trong mỗi chu kỳ thanh toán.
          </Paragraph>
          <Paragraph className="term-content">
            3. Không vi phạm các điều khoản được đề cập trong quy định này hay
            hợp đồng thỏa thuận giữa hai bên.
          </Paragraph>
          <Paragraph className="term-content">
            4. Khai báo đủ và chính xác các thông tin mà AppotaPay yêu cầu.
          </Paragraph>
        </Paragraph>
        <Paragraph>
          6. <Text strong>Quy định về bảo mật thông tin.</Text>
          <Paragraph>
            1.Thông tin
            <Paragraph className="term-content">
              Đối tác phải khai báo chính xác tất cả thông tin bao gồm: Họ tên,
              Email, Số điện thoại di động, số chứng thực (CMND, Hộ chiếu), địa
              chỉ hoặc Tên doanh nghiệp, số Đăng ký kinh doanh, email, điện
              thoại và địa chỉ liên lạc.
            </Paragraph>
            <Paragraph className="term-content">
              Để đảm bảo Đối tác có khả năng truy cập vào hệ thống AppotaPay và
              sử dụng các tính năng một cách đầy đủ.
            </Paragraph>
            <Paragraph className="term-content">
              Để đảm bảo Đối tác sẽ nhận được những thông báo liên quan đến tài
              khoản, giao dịch của Đối tác nhanh chóng và chính xác.
            </Paragraph>
            <Paragraph className="term-content">
              Để giải quyết thuận tiện và nhanh chóng nhất các khiếu nại phát
              sinh trong quá trình giao dịch tại AppotaPay.
            </Paragraph>
            <Paragraph className="term-content">
              Để đáp ứng một trong các điều kiện khi Đối tác yêu cầu rút tiền từ
              tài khoản.
            </Paragraph>
          </Paragraph>
          <Paragraph>
            2.Trách nhiệm của AppotaPay
            <Paragraph className="term-content">
              Bảo mật tuyệt đối thông tin Đối tác và thông tin tài khoản của Đối
              tác.
            </Paragraph>
            <Paragraph className="term-content">
              Không bán, cung cấp thông tin của Đối tác cho bên thứ ba trừ
              trường hợp theo yêu cầu của các cơ quan chức năng có thẩm quyền.
            </Paragraph>
            <Paragraph className="term-content">
              Phối hợp và cung cấp thông tin cho cơ quan chức năng khi xảy ra
              khiếu nại, tố cáo với các hành vi lừa đảo về tài chính, các hành
              vi vi phạm pháp luật.
            </Paragraph>
            <Paragraph className="term-content">
              Thông báo đầy đủ cho Đối tác khi có những hành vi tác động, thay
              đổi, cập nhật, quá hạn liên quan đến thông tin của Đối tác.
            </Paragraph>
          </Paragraph>
          <Paragraph>
            3.Trách nhiệm của đối tác
            <Paragraph className="term-content">
              Khai báo đầy đủ và chính xác các thông tin Đối tác và tài khoản.
            </Paragraph>
            <Paragraph className="term-content">
              Cập nhật thường xuyên khi có thay đổi về những thông tin trên.
            </Paragraph>
            <Paragraph className="term-content">
              Bảo mật tối đa thông tin cá nhân của Đối tác, không nên trao đổi,
              cho mượn tài khoản tại AppotaPay.
            </Paragraph>
            <Paragraph className="term-content">
              Báo ngay cho AppotaPay khi bị mất, thất lạc, lộ thông tin tài
              khoản Đối tác.
            </Paragraph>
            <Paragraph className="term-content">
              Phối hợp với AppotaPay và cơ quan chức năng khi xảy ra tranh chấp,
              khiếu nại liên quan đến tài khoản.
            </Paragraph>
            <Paragraph className="term-content">
              Tuân thủ các quy định về an toàn và bảo mật thông tin.
            </Paragraph>
          </Paragraph>
          <Paragraph>
            4. Khi thực hiện một lệnh giao dịch trên hệ thống AppotaPay, Đối tác
            có trách nhiệm tìm hiểu rõ giao dịch, AppotaPay không chịu trách
            nhiệm do những nhầm lẫn của Đối tác.
          </Paragraph>
        </Paragraph>
      </Space>
    </CustomModal>
  );
};

export default ModalTerm;
