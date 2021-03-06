import React, { useRef, useState, useEffect } from 'react';
import { Button, Space, Mask, DotLoading } from 'antd-mobile';
import { BrowserRouter as Router, Route, Link, Routes, useNavigate } from "react-router-dom";
import { GetSessionCode, VideoVerify } from '../../Util/Util';
import avator from '../../assets/images/avator.png';
import './index.css';
import axios from 'axios';

export const VideoLive = () => {
    const camRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [sessionCode, setSessionCode] = useState('');
    const [actions, setActions] = useState('');
    const [btnDisable, setBtnDisable] = useState(false);

    const [token, setToken] = useState<string>();

    useEffect(() => {
        const fn = async () => {
            const tempToken = await GetToken();

            if (!tempToken)
                return;

            setToken(tempToken);

            debugger;
            GetSessionCode(tempToken).then((result) => {
                if (result[0] === 'XXX') {
                    setBtnDisable(true);
                    return;
                }
                setSessionCode(result[0]);
                setActions(result[1]);
            });
        };

        fn();

    }, []);

    const GetToken = async (): Promise<string> => {
        // fetch('https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=R28VSZLeBFw1w8b3yrz67Ait&client_secret=Drzmlb7qNQfGoePWv2bptetZ2yzaRUGn', {
        //     method: "Post",
        //     mode:'no-cors',
        //     headers: {
        //         'Content-Type': 'text/plain'
        //     }
        // })

        const token = await axios.get('http://106.75.216.135:8004/api/livedetect/token');

        // const token = await fetch('https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=R28VSZLeBFw1w8b3yrz67Ait&client_secret=Drzmlb7qNQfGoePWv2bptetZ2yzaRUGn', {
        //     method: "Post",
        //     mode: 'no-cors',
        //     headers: {
        //         'Content-Type': 'text/plain'
        //     }
        // }).then(response => {
        //     debugger;
        //     return response.json();
        // }).catch(error => {
        //     debugger;
        //     console.log(error);
        //     alert('???????????????????????????');
        //     return '';
        // });

        debugger;
        return token.data.access_token;
    }

    const navigate = useNavigate();

    const onCameraClick = () => {
        camRef.current && (camRef.current as HTMLInputElement).click();
    }

    const goMenu = () => {
        navigate('/');
    }

    const fileChange = (ev: any) => {
        var video = ev.target.files[0];  //???????????????
        //https://blog.csdn.net/ligongke513/article/details/116231794
        //??????????????????
        //var file = new File([video], 'temp.mp4',{type: 'video/mp4;codecs=h264;acodec=aac'});
        let reader = new FileReader();

        reader.readAsDataURL(video);
        // reader.readAsArrayBuffer(img)

        reader.onload = function (e: any) {
            setLoading(true);

            var dataBase64 = e.target.result; //result??????????????????????????????????????????????????????????????????
            //console.log(encodeURIComponent(dataBase64.split(',')[1]));

            if (dataBase64) {
                //?????????base64???????????????????????????????????? data:video/mp4;base64,???
                //setVideoStr(dataBase64.substring(45));
                //VideoVerify(token, sessionCode, encodeURI(dataBase64.substring(45)));
                VideoVerify(token ?? '', sessionCode, encodeURIComponent(dataBase64.split(',')[1]))
                    .then((score) => {
                        if (score >= 0.75) {
                            navigate('/success');
                        }
                        else {
                            navigate('/fail');
                        }

                        setLoading(false);
                    });
            }
        }
    }

    return (
        <>
            <p className='title'>????????????????????????</p>
            <img src={avator} alt='avator' style={{ width: '30vw', left: '35vw', position: 'relative' }} />
            <p className='action-num'>{actions}</p>
            <ul className='notice'>
                <li>???????????????????????????</li>
                <li>??????????????????</li>
                <li>???????????????????????????</li>
                <li>??????3?????????</li>
            </ul>
            {/* <div className='list'>
                <div className='left'>
                    <img src={require("../../assets/images/subtitle-user.png")} alt="" className='subtitle-img' />
                </div>

                <div className='list-text'>
                    <p className='main-title'>??????????????????</p>
                    <p>??????????????????????????????????????????</p>
                </div>
            </div>

            <div className='list'>
                <div className='left'>
                    <img src={require("../../assets/images/subtitle-light.png")} alt="" className='subtitle-img' />
                </div>
                <div className='list-text'>
                    <p className='main-title'>??????????????????</p>
                    <p>???????????????????????????????????????????????????</p>
                </div>
            </div>

            <div className='list'>
                <div className='left'>
                    <img src={require("../../assets/images/subtitle-face.png")} alt="" className='subtitle-img' />
                </div>
                <div className='list-text'>
                    <p className='main-title'>??????????????????</p>
                    <p>????????????????????????????????????</p>
                </div>
            </div> */}

            <Space wrap block style={{ '--gap-vertical': '12px', position: 'fixed', bottom: '30px', left: '15vw' }} align='center' justify='center' direction='vertical'>
                <Button disabled={btnDisable} shape='rounded' block color='primary' size='large' onClick={onCameraClick} style={{ width: '70vw' }}>
                    ????????????
                </Button>
                <input type='file' id='videoLive' accept='video/*' capture='user' onChange={fileChange}
                    style={{ display: 'none' }} ref={camRef} />
            </Space>

            {/* <Mask visible={loading} onMaskClick={() => setLoading(false)} /> */}
            <Mask visible={loading}>
                <DotLoading color='springgreen' style={{
                    position: 'fixed',
                    top: '50%',
                    left: '27%',
                    textAlign: 'center',
                    fontSize: 'xxx-large'
                }} />
            </Mask>
        </>
    )
}