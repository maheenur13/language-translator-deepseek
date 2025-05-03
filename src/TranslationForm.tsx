/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, Input, Select, message } from "antd";
import type { FormProps } from 'antd';
import { useState } from "react";
import { CopyOutlined } from '@ant-design/icons';

const { TextArea } = Input;

type FieldType = {
    originalText?: string;
    translateTo?: string;
};

// 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
const TranslationForm = () => {
    const [loading, setIsLoading] = useState<boolean>(false)
    const [data, setData] = useState<any>(null)

    const handleCopy = () => {
        if (data) {
            navigator.clipboard.writeText(data)
                .then(() => {
                    message.success('Text copied to clipboard!');
                })
                .catch(() => {
                    message.error('Failed to copy text');
                });
        }
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setData(null);
        setIsLoading(true);
        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
                    "HTTP-Referer":
                        "https://language-translator-deepseek.netlify.app/", // Optional. Site URL for rankings on openrouter.ai.
                    "X-Title": "Language Translator", // Optional. Site title for rankings on openrouter.ai.
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "deepseek/deepseek-r1:free",
                    messages: [
                        {
                            role: "user",
                            content: `Translate the following sentence into ${values.translateTo} language. Return only the translated sentence without any explanation or extra text:\n\n${values.originalText}`,
                        },
                    ],
                }),
            }
        );
        const data = await response.json();
        setData(data.choices[0]?.message?.content);
        setIsLoading(false)

    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div >
            <h1 style={{
                textAlign: "center",
                fontWeight: 700,
                fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
                marginBottom: "clamp(1rem, 3vw, 2rem)",
                background: "linear-gradient(45deg, #a8a8a8, #7b9eef)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
            }}>
                Language Translator Using <span style={{
                    background: "linear-gradient(45deg, #0043fd, #00a1ff)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    padding: "4px 12px",
                    borderRadius: "12px",
                    fontWeight: 800,
                    position: "relative",
                    display: "inline-block",
                    marginTop: '.5rem'
                }}>
                    DeepSeek
                    <span style={{
                        content: "",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "linear-gradient(45deg, rgba(0,67,253,0.2), rgba(0,161,255,0.2))",
                        borderRadius: "12px",
                        zIndex: -1,
                        animation: "pulse 2s ease-in-out infinite"
                    }}></span>
                </span>
            </h1>
            <Form
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                layout="horizontal"
                onFinish={onFinish}
                style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item<FieldType>
                    name={"originalText"}
                    label="Your text"
                    rules={[{ required: true, message: "Please enter your text!" }]}
                >
                    <TextArea
                        size="large"
                        rows={6}
                        placeholder="Enter text to translate"
                        style={{ resize: "vertical", minHeight: "120px" }}
                    />
                </Form.Item>
                <Form.Item<FieldType>
                    name={"translateTo"}
                    label="Select a language to translate"
                    rules={[
                        { required: true, message: "Please select your language!" },
                    ]}
                >
                    <Select
                        size="large"
                        options={[
                            { label: "Bangla", value: "Bengali" },
                            { label: "German", value: "Deutsch" },
                            { label: "Arabic", value: "Arabic" },
                            { label: "English", value: "English" },
                        ]}
                    />
                </Form.Item>
                <Form.Item label={null} style={{ textAlign: "center" }}>
                    <Button
                        loading={loading}
                        style={{ width: "100%", maxWidth: "300px" }}
                        size="large"
                        type="primary"
                        htmlType="submit"
                    >
                        {loading ? "Translating please wait..." : "Translate"}
                    </Button>
                </Form.Item>
            </Form>
            <div
                style={{
                    padding: ".75rem",
                    border: "1px solid #606060",
                    borderRadius: "0.5rem",
                    backgroundColor: "#cdcdcdec",
                    marginTop: "1rem",
                    minHeight: "80px",
                    maxHeight: '180px',
                    overflowY: 'auto',
                    maxWidth: "100%",
                    margin: "auto",
                    position: "relative"
                }}
            >
                <div style={{
                    position: "absolute",
                    top: "0",
                    right: "0",
                    cursor: "pointer",
                    opacity: data ? 1 : 0.5,
                    background: "rgba(255, 255, 255, 0.9)",
                    padding: "4px 6px",
                    borderRadius: "4px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    zIndex: 1
                }}>
                    <CopyOutlined
                        onClick={handleCopy}
                        style={{
                            fontSize: "16px",
                            color: "#1a1a2e"
                        }}
                    />
                </div>
                <p style={{
                    padding: 0,
                    margin: 0,
                    color: data ? '#000000' : '#6d6d6d',
                    wordBreak: "break-word"
                }}>
                    {data ? data : "your translated text will be appear here!"}
                </p>
            </div>
        </div>
    );
};

export default TranslationForm;
