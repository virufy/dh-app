import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import keepDistance from '../../../../assets/images/keepDistance.png';
import mouthDistance from '../../../../assets/images/mouthDistance.png';
import BackIcon from '../../../../assets/images/back-icon.png';
import Upload from '../../../../assets/images/upload.svg';

import * as S from './styles';

const schema = Yup.object({
    file: Yup.mixed()
        .required('Please upload a file')
        .test('fileSize', 'File too large', (value?: any) => {
            if (!value) return false;
            return value.size <= 5 * 1024 * 1024; // 5MB
        })
        .test('fileDuration', 'Audio must be at least 3 seconds', async (value?: any) => {
            if (!value) return false;
            const audio = new Audio(URL.createObjectURL(value));
            await new Promise(resolve => audio.addEventListener('loadedmetadata', resolve));
            return audio.duration >= 3;
        }),
}).required();

function CoughRecordScreen() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [involuntary, setInvoluntary] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm(
        // {
        // resolver: yupResolver(schema),
    // }
    );

    const handleBack = () => navigate(-1);
    const toggleInvoluntary = () => setInvoluntary(!involuntary);

    const onSubmit = (data: any) => {
        const file = data.file;

        if (!file) {
            // Let it go through for now (no validation)
            navigate('/upload-complete', {
                state: {
                    audioFileUrl: '', // or use placeholder
                    filename: 'No file selected',
                },
            });
        } else {
            const audioFileUrl = URL.createObjectURL(file);
            navigate('/upload-complete', {
                state: {
                    audioFileUrl,
                    filename: file.name,
                },
            });
        }
    };


    const triggerFileInput = () => fileInputRef.current?.click();

    return (
        <S.Container>
            <S.Content>
                <S.Header>
                    <S.BackButton onClick={handleBack}>
                        <img src={BackIcon} alt="Back" />
                    </S.BackButton>
                    <h2>Record your cough</h2>
                </S.Header>

                <S.Paragraph><strong>1</strong>. Find a quiet place...</S.Paragraph>
                <S.Image src={keepDistance} />
                <S.Paragraph><strong>2</strong>. Hold the bottom of your device...</S.Paragraph>
                <S.Image src={mouthDistance} />
                <S.Paragraph><strong>3</strong>. Tap record, cough 3 times...</S.Paragraph>

                <S.Timer>0:00</S.Timer>

                <S.ButtonGroup>
                    <S.RecordButton>Record</S.RecordButton>
                    <S.StopButton>Stop</S.StopButton>
                </S.ButtonGroup>

                <S.CheckboxRow>
                    <label htmlFor="involuntary">Were your coughs involuntary?</label>
                    <input
                        id="involuntary"
                        type="checkbox"
                        checked={involuntary}
                        onChange={toggleInvoluntary}
                    />
                </S.CheckboxRow>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="file"
                        control={control}
                        render={({ field }) => (
                            <>
                                <S.UploadButton type="button" onClick={triggerFileInput}>
                                    <img src={Upload} alt="Upload" />
                                    Upload your own file
                                </S.UploadButton>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept="audio/*"
                                    style={{ display: 'none' }}
                                    onChange={(e) => field.onChange(e.target.files?.[0])}
                                />
                            </>
                        )}
                    />
                    {/*{errors && errors.file && (*/}
                    {/*    {typeof errors.file?.message === 'string' && (*/}
                    {/*            <p style={{ color: 'red' }}>{errors.file.message}</p>*/}
                    {/*        )}*/}

                    {/*)}*/}

                    <S.ContinueButton type="submit">Continue</S.ContinueButton>
                </form>

                <S.Footer>
                    Something wrong? <a href="https://docs.google.com/forms/...">Report an error</a>
                </S.Footer>
            </S.Content>
        </S.Container>
    );
}

export default CoughRecordScreen;