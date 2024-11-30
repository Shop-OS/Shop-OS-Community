import useApparel from '@/app/apparel-shoots/provider/useApparel'
import { EllipsisOutlined, LoadingOutlined } from '@ant-design/icons'
import React, { useEffect } from 'react'
import AxiosProvider from '@/utils/axios';
import { Spin } from 'antd';
import { format } from 'date-fns';



function GenerationHistory() {
    const { generationHistory, setGenerationHistory, currentHistory, setCurrentHistory, setPreviewImageSrc } = useApparel();
    const [isHistoryLoading, setIsHistoryLoading] = React.useState<boolean>(false);

    const getHistory = async () => {
        try {
            setIsHistoryLoading(true);
            setGenerationHistory([]);
            setCurrentHistory({});
            const response = await AxiosProvider.get('api/generations?target=apparel');
            console.log("response", response)

            let data: any = {};

            response.data.forEach((item: any) => {
                if (!data[item.generationId]) {
                    data[item.generationId] = item;
                }
                if (!data[item.generationId].items) {
                    data[item.generationId].items = [];
                }

                data[item.generationId].items.push(item);
            });

            setGenerationHistory(Object.values(data).reverse());
            // setGenerationHistory(response.data);
            setIsHistoryLoading(false);
        } catch (error) {
            setGenerationHistory([]);
            setIsHistoryLoading(false);
            console.log("error", error)
        }
    }
    useEffect(() => {
        getHistory();
    }, [])

    const getRelativeTime = (timestamp: string) => {
        const dateformat = 'yyyy-MM-dd HH:mm:ss';

        return format(new Date(timestamp), dateformat);
    }

    return (
        <div
            style={{
                padding: '10px 20px 20px',
                height: '100%',
                overflow: 'auto',
            }}
        >
            <h3 style={{ color: 'white' }}>Previous tasks</h3>

            {isHistoryLoading ? <div
                style={{
                    alignItems: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: '100%',
                    border: '1px solid #2a2a2a',
                    borderRadius: '10px',
                    padding: '12px 63.5px 12px 63.5px',
                }}
            >
                <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                <span style={{ paddingLeft: '18px' }}>Loading...</span>
            </div> :
                generationHistory?.length == 0 ? "No history found" :
                    generationHistory.map((item: any, index: number) => (
                        <div
                            style={{
                                display: 'flex',
                                backgroundColor: currentHistory.generationId == item.generationId ? "#2F2D2D" : "#181717",
                                padding: '10px 15px',
                                borderRadius: '8px',
                                alignItems: 'center',
                                gap: '10px',
                                cursor: 'pointer',
                                marginBottom: 10
                            }}
                            key={item.generationId}
                            onClick={() => {
                                setCurrentHistory(item);
                                setPreviewImageSrc({});
                            }}
                        >
                            <img
                                height={40}
                                src={item.inputImageURL ?? "https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg"}
                                alt="image"
                                style={{
                                    borderRadius: '4px',
                                }}
                            />
                            <div>
                                {getRelativeTime(item.timestamp)}
                            </div>
                            <div style={{ marginLeft: "auto" }}>
                                <EllipsisOutlined disabled />
                            </div>
                        </div>))}
        </div>
    )
}

export default GenerationHistory