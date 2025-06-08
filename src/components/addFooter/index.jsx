import './style.css';
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Modal, Button } from 'antd';
import sections from "../../sections";

function Footer() {
  const location = useLocation();
  const [modalInfo, setModalInfo] = useState({ visible: false, title: '', content: '' });

  const showModal = (key) => {
    const section = sections[key];
    setModalInfo({
      visible: true,
      title: section.title,
      content: section.content,
    });
  };

  const handleOk = () => {
    setModalInfo(prev => ({ ...prev, visible: false }));
  };

  return (
    <>
      {location.pathname !== "/workoutprogress" && (
        <footer className="footer">
          <div>
            <img
              src='/img-pack/logo/logo2_white.png'
              style={{ width: "10%" }}
              alt="Логотип"
            />
            <div className="buttonBlock">
              <Button type="default" onClick={() => showModal("policy")}>Політика конфіденційності</Button>
              <Button type="default" onClick={() => showModal("terms")}>Умови користування</Button>
              <Button type="default" onClick={() => showModal("about")}>Про нас</Button>
            </div>
          </div>

          <Modal
            open={modalInfo.visible}
            title={modalInfo.title}
            onOk={handleOk}
            onCancel={handleOk}
            centered
            footer={[
              <Button key="ok" type="primary" onClick={handleOk}>
                Закрити
              </Button>,
            ]}
          >
            <div>
              {modalInfo.content.split('\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph.trim()}</p>
              ))}
            </div>
          </Modal>

          <div>
            <img src='/img-pack/logo/logo_white.png' alt="Логотип" />
          </div>

          <div>
            <p className='description'>
              Додаток "SportLife" надає широкий спектр можливостей для спортсменів і тренерів.
              Тренери можуть переглядати права для різних груп вправ, стежити за прогресом і підбирати індивідуальні плани тренувань дистанційно.
              У свою чергу спортсмени можуть проходити персоналізовані програми, відстежувати свої результати та отримувати зворотний зв’язок у реальному часі.
              Це забезпечить ефективну взаємодію між спортсменами та тренерами задля досягнення їхніх фітнес-цілей.
            </p>
          </div>

          <div>
            <p className="policyText">- © Всі права захищено Octafxt 2024</p>
          </div>
        </footer>
      )}
    </>
  );
}

export default Footer;
