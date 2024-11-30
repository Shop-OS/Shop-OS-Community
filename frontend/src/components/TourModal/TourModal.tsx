import useHomProvider from '@/provider/useHoMProvider'
import { Button, Modal } from 'antd';
import React from 'react'

function TourModal() {
    const { showTour, setShowTour, tourType } = useHomProvider();
    return (
        <Modal
            onCancel={() => {
                setShowTour(false);
            }}
            centered
            open={showTour}
            footer={null}
            title={tourType}
            closeIcon={null}
            width={"70%"}
        >
            <div style={{
                padding: "10px",
                textAlign: "center",
            }}>
                <video width="100%"
                    controls
                    autoPlay={false}
                >
                    <source src={`/tour/${tourType}.mp4`} type="video/mp4" />
                </video>
            </div>

            <div style={{
                display: "flex",
                justifyContent: "flex-end",
                padding: "8px 10px ",
            }}>
                <Button
                    onClick={() => {
                        setShowTour(false);
                    }}
                    type="primary"
                >
                    Skip
                </Button>
            </div>
        </Modal>
    )
}

export default TourModal