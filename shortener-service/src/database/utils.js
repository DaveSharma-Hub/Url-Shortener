import 'dotenv/config';

export const getAWSConfig = () => {
    const config = {
        
    };

    if(process.env.ENV === 'DEVELOPMENT'){
        config.endpoint = "http://localhost:8000";
        config.region = "local"
    }
    return config;
}