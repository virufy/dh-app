import React from 'react';
import SehaDubaiLogo from '../../assets/images/SehaDubaiLogo.png';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Container,
    InnerWrapper,
    Logo,
    Title,
    ButtonStyled,
    ErrorLink
} from './style';

const ConfirmationScreen: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    return (
        <Container>
            <InnerWrapper>
                <Logo src={SehaDubaiLogo} alt="Dubai Health Logo" />
                <Title>
                    {t('confirmation.titleLine1')}
                </Title>
                <ButtonStyled onClick={() => navigate('/')}>
                    {t('confirmation.button')}
                </ButtonStyled>
                <ErrorLink href="#">
                    {t('confirmation.report')}
                </ErrorLink>
            </InnerWrapper>
        </Container>
    );
};

export default ConfirmationScreen;
