// src/components/forms/EnglishConsent.tsx
import React from "react";

const EnglishConsent: React.FC = () => {
    return (
        <div
            style={{
                maxHeight: '300px',
                overflowY: 'auto',
                border: '1px solid black',
                padding: '1rem',
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
                fontSize: '12px',
                lineHeight: 1.5,
                whiteSpace: 'pre-line',
                color: '#000',
                fontWeight: 'normal'
            }}
        >
            <p style={{ textAlign: 'center' }}><b>Institutional Review Board (MBRU-IRB)
                Participant/Patient Information Sheet/Informed Consent</b></p>
            <p style={{ color: 'Blue', textAlign: 'center' }}>Participant/ Patient Information Sheet
                and Informed Consent Form</p>
            <p style={{ textAlign: 'center' }}><b><u>Informed Consent to Participate in a Research
                Study</u></b></p>
            <p><b>1. Study Title:</b> Smartphone-Based Respiratory Disease Screening via
                Breathing Sound AI Analysis</p>
            <p><b>The above-mentioned study has been approved by <mark>the Dubai Scientific
                Research Ethics Committee, DHA</mark></b></p>
            <p><b>Principal Investigator: Yacine Hadjiat</b></p>
            <p style={{ margin: 0, fontSize: '12px' }}>
                <b>Address:</b>{' '}
                <span style={{
                    color: 'blue',
                    display: 'inline-block',
                    verticalAlign: 'top'
                }}>
                    Mohammed Bin Rashid University of Medicine and Health Sciences<br />
                    Building No 14, Dubai Health Care City<br />
                    Dubai - UAE
                </span>
            </p>


            <p><b> Phone: </b> <span style={{ color: 'blue' }}> +971527689649</span></p>
            <p><b>Sites where the study will be conducted: </b> Al Barsha Health Centre, Nadd Al
                Hammar Health Center</p>
            <p>
                <b>You are invited to participate in this research study conducted at <mark>Dubai
                    Health .</mark> Please, take your time to read the
                    following information carefully, before you decide whether you wish to take part
                    in this research study or not . You
                    are encouraged to ask the study investigator if you need any additional
                    information or clarification about what is
                    stated in this form and/or in the research study as a whole. You are
                    also free to take this information sheet and
                    consult with your doctor or other health professionals. Please note
                    that, should you decide to participate, you are
                    free to withdraw at any time without any consequence. </b>
            </p>
            <p><b>The purpose of the Research Study and Overview of
                Participation </b></p>
            <p style={{ color: 'blue' }}>
                We are doing this research study to see if a special computer program,
                called Artificial Intelligence or AI, can
                help us find out if someone might have a common breathing infectious
                illness like the flu, RSV (another common
                breathing virus), or COVID-19. We want to see if this AI program can do
                this by listening to the sounds of your
                cough and your breathing, recorded on a regular smartphone.
            </p>
            <p style={{ color: 'blue' }}>
                The main idea is to collect sound recordings (like when you cough,
                breathe deeply, or make a simple sound like
                "aaaah") and some basic health information from people in the UAE. You
                are being asked because you are already
                scheduled to have a standard test for breathing illnesses at a Dubai
                Health clinic.
            </p>
            <p style={{ color: 'blue' }}>
                Your sound recordings will be used to develop, train, fine-tune, and
                test the AI computer program. We want to find
                out how well it can spot signs of these breathing illnesses just from
                the sounds you make.
            </p>
            <p style={{ color: 'blue' }}>
                If this works well, this new technology could become a quick, easy, and
                not too expensive way for people like you,
                doctors, and health officials to find breathing diseases earlier before
                they spread broadly. This could help manage
                these illnesses better in the UAE and keep our community healthier.
            </p>
            <p><b>
                What is the duration of the study? </b></p>
            <p style={{ color: 'blue' }}>Your part in this study will only
                take about 5-15 minutes of your time during
                your visit to the clinic today. This includes the time it takes for us
                to explain the study to you, for you to ask
                questions, to sign this form if you agree, to answer some health
                questions, and to make the sound recordings. The
                whole research project will involve collecting information from many
                people over several months (from around late
                August to December 2025), but you will only need to be involved in this
                one short session.
            </p>
            <p><b>Participation in the study – Why participate, what will happen on
                participation, what is required of the participant/patient. </b></p>
            <p style={{ color: 'blue' }}>
                <b> Why am I being invited to participate? </b>You are being invited to join
                this study because you are an adult (18 years
                old or older) and you are at a Dubai Health clinic to have a standard
                test for a breathing illness. This might be
                because you have symptoms, or because you fit into a group we are
                interested in learning more about, such as people
                who are pregnant, have a fever, or have asthma, as these can also
                involve breathing symptoms. By including
                different people, we hope to get good information to help train the AI
                program.
            </p>
            <p style={{ color: 'blue' }}>
                <b>What will happen if I decide to take part? </b> If you agree to be in this
                study, here’s what will happen:
            </p>
            <div style={{ color: 'blue' }}>
                <ol style={{ paddingLeft: '20px' }}>
                    <li>
                        <b>Explanation and Giving Consent:</b> A nurse or another member of our
                        study team will explain
                        everything about the study. They will answer any questions you have. If you
                        decide to join, we
                        will ask you to sign this consent form.
                    </li>

                    <li>
                        <b>Study ID:</b> To protect your privacy, you will be given a special study
                        ID number. This
                        number, not your name, will be used on all your study information.
                    </li>

                    <li>
                        <b>Health Questions:</b> The study staff will ask you some questions about
                        your health. This
                        will include:
                        <ul style={{ paddingLeft: '20px', marginTop: '4px', marginBottom: '4px' }}>
                            <li>Your age, gender, and ethnicity.</li>
                            <li>If you have any flu-like symptoms now, and when they started.</li>
                            <li>If you smoke.</li>
                            <li>About any other important health conditions you have (like asthma or
                                other lung problems).
                            </li>
                            <li>Any medicines you are taking for cough or breathing problems.</li>
                            <li>If you’ve had vaccines for COVID-19 or the flu.</li>
                        </ul>
                        <p>
                            The staff will type your answers into a secure study app on a smartphone
                            or
                            tablet. With your
                            permission, some of this information might also be collected from your
                            medical record, using
                            only your study ID.
                        </p>
                    </li>

                    <li>
                        <b>Making Sound Recordings:</b> The study staff will use a smartphone with
                        the study app to record
                        some sounds. They will ask you to do the below while holding the smartphone
                        about an arm's
                        length away from your mouth:
                        <ul style={{ paddingLeft: '20px', marginTop: '4px', marginBottom: '4px' }}>
                            <li>Cough strongly a few times into the smartphone (about 3 times).</li>
                            <li>Breathe deeply a few times into the smartphone (about 3 times).</li>
                            <li>Make an "aaaah" sound for a few seconds into the smartphone.</li>
                        </ul>
                    </li>

                    <li>
                        <b>Your Regular Medical Test:</b> After this, you will have the usual
                        breathing illness test (like
                        a PCR test from a nose or throat swab) and/or a chest x-ray that your doctor
                        has already arranged
                        for you. This test is part of your normal medical care and is NOT an extra
                        test just for this
                        study. However, we will use the results of this test (without your name) for
                        our research to see
                        how it compares to what the AI program finds from your sounds.
                    </li>

                    <li>
                        <b>Linking Your Test Results:</b> Later, the results from your breathing
                        test and/or chest x-ray
                        will be linked to your study ID and your sound recordings for the research.
                        This will all be done
                        anonymously.
                    </li>

                    <li>
                        <b>What Happens to Your Anonymized Information:</b> Once your information
                        (like sound recordings and
                        health details) has been collected and has had all personal identifiers like
                        your name removed
                        (this is called anonymization), this anonymized data will be owned by
                        Virufy. Virufy and its
                        research and commercial partners may use this anonymized data for ongoing
                        academic research, to
                        further develop, train, fine-tune, and improve Virufy’s AI tool, in
                        scientific publications, at
                        conferences, and potentially for commercial purposes around the world to
                        make this technology
                        available to others. Your personal identity will not be disclosed in any of
                        these uses.
                    </li>
                </ol>
            </div>
            <div style={{ fontSize: '12px', lineHeight: 1.5 }}>
                <p><b>Any Risks as a Result of Participating in the Study</b></p>
                <p style={{ color: 'blue' }}>
                    Taking part in this study has very few risks, and they are similar to
                    things you might do every day or during a
                    normal visit to the doctor.</p>

                <ul style={{ paddingLeft: '20px', color: 'blue' }}>
                    <li>
                        <b>Discomfort from Coughing:</b> When you are asked to cough, it might feel
                        a little uncomfortable
                        for a moment, like a tickle in your throat, or very rarely, you might feel a
                        bit dizzy for a
                        second. We will ask you to do this in a way that is comfortable for you. You
                        can stop at any time
                        if you don't feel well. The study staff will be there with you.
                    </li>

                    <li>
                        <b>Spreading Germs:</b> There's a very tiny extra chance of spreading germs
                        when you cough. However,
                        this will happen in a clinic where they already have rules to stop germs
                        from spreading. The study
                        staff will use clean practices, and the phone used for recording will be
                        cleaned often.
                    </li>

                    <li>
                        <b>Privacy:</b> We take your privacy very seriously. There is always a very
                        small risk that
                        information about you could be seen by someone who shouldn't. To prevent
                        this, we will:
                        <ul style={{ paddingLeft: '20px', marginTop: '4px' }}>
                            <li>Give you a study ID so your name is not directly linked to your
                                sounds or health answers used by the AI research team.
                            </li>
                            <li>Store your information securely.</li>
                            <li>Limit who can see your information.</li>
                            <li>Handle your personal information in accordance with <a href="https://virufy.org/en/privacy-policy/"> Virufy’s Privacy
                                Policy</a>.
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>


            <p><b>Any Benefits as a Result of Participating in the Study</b></p>

            <p style={{ color: 'blue' }}>
                You will <b>not get any direct medical benefit</b> from being in this study. This
                study is not
                designed to give you a diagnosis or treatment for any illness. We will not tell you
                or your doctor
                what the AI program thinks about your sounds because it is still being tested.
            </p>

            <p style={{ color: 'blue' }}>
                However, by taking part, you will be helping us in a very important way. Your
                information could help
                us create a new technology that might:
            </p>

            <ul style={{ color: 'blue', paddingLeft: '20px' }}>
                <li>
                    Help other people in the future by creating a quick, easy, and cheap way to
                    check for breathing
                    illnesses in the UAE and maybe even around the world.
                </li>
                <li>
                    Help doctors and health services deal with outbreaks of illnesses more
                    effectively.
                </li>
                <li>
                    Help make progress in using AI for healthcare in the UAE.
                </li>
            </ul>

            <p><b>
                Any Alternative Treatment </b>
            </p><p style={{ color: 'blue' }}>
                The only alternative to being in this research study is to choose not to
                be in it. If you decide not to take part,
                it will not change your normal medical care at Dubai Health in any way.
                You will still get your planned breathing
                test and any other care your doctor thinks you need.</p>
            <p><b>
                If you agree to take part in this research study, please, be assured
                that the obtained information will be kept
                confidential. Unless required by law, only the study investigator or
                designee, the MBRU-Institutional Review Board
                (MBRU-IRB), <mark>the Dubai Scientific Research and Ethics Committee (DSREC) </mark>
                and/or inspectors from governmental agencies
                will have direct access to your information. If you are harmed by taking
                part in this research project, there are
                no special compensation arrangements. If you are harmed due to someone’s
                negligence, or have any concerns about any
                aspect of the way you have been approached or treated during the course
                of this study, you can contact Dubai
                Scientific Research Ethics Committee, DHA on 800 342 or email on
                DSREC@dha.gov.ae </b></p>
            <p style={{ color: 'blue' }}>
                As this study does not involve the administration of a new drug,
                treatment, or procedure (aside from causing you
                to cough), it is unlikely to cause any injury and no compensation will
                be provided.
            </p>
            <p><b><u>
                Investigator’s Statement: </u></b></p>
            <p><b>
                I have reviewed, in detail, the informed consent document for this
                research study with ________________ (name of
                participant, patient, legal representative, or parent/guardian) the
                purpose of the study and its risks and
                benefits. I have answered all the participant’s questions clearly. I
                will inform the participant in case of any
                changes to the research study. </b>
            </p>
            <div style={{ marginTop: '20px' }}>
                <table
                    style={{
                        borderCollapse: 'separate',
                        borderSpacing: '10px 0',
                        fontSize: '12px',
                        width: '100%',
                        textAlign: 'center',
                    }}
                >
                    <tbody>
                        <tr>
                            <td
                                style={{
                                    borderBottom: '1px solid black',
                                    paddingBottom: '40px',
                                    width: '40%',
                                }}
                            ></td>
                            <td
                                style={{
                                    borderBottom: '1px solid black',
                                    paddingBottom: '40px',
                                    width: '30%',
                                }}
                            ></td>
                            <td
                                style={{
                                    borderBottom: '1px solid black',
                                    paddingBottom: '40px',
                                    width: '30%',
                                }}
                            ></td>
                        </tr>

                        <tr>
                            <td><b>Name of Investigator or Designee </b></td>
                            <td><b>Signature</b></td>
                            <td><b>Date &amp; Time </b></td>
                        </tr>
                    </tbody>
                </table>


            </div>


            <p><b><u>
                Participant’s Declaration:</u></b>
            </p><p><b>
                I have read and understood all aspects of the research study and all my
                questions have been answered. I voluntarily
                agree to be a part of this research study, and I know that I can contact
                <span style={{ fontWeight: 'normal' }}> <u> Yacine Hadjiat</u> </span> at <span
                    style={{ fontWeight: 'normal' }}><u> +971527689649 </u></span> or any of
                his/her team involved in the study in case I have any questions. If I
                feel that my questions have not been
                answered, I can contact the DSREC ( <a
                    href="mailto:DSREC@dha.gov.ae"> DSREC@dha.gov.ae</a>). I understand that
                sections of any of my medical notes may be
                looked at by responsible individuals from Virufy Dubai or from
                regulatory authorities where it is relevant to my
                taking part in research. I give permission for these individuals to have
                access to my records. I understand that I
                am free to withdraw this consent and discontinue participation in this
                project at any time, even after signing this
                form, and it will not affect my care or benefits. I know that I will
                receive a copy of this signed informed
                consent.
            </b>
            </p>
            <p><b>
                I agree to take part in the above study.</b></p>


            <table style={{
                borderCollapse: 'collapse',
                fontSize: '12px',
                border: '1px solid black',
            }}>
                <tbody>
                    <tr>
                        <td style={{ height: '35px', border: '1px solid black', padding: '4px' }}>
                        </td>
                        <td style={{ border: '1px solid black', padding: '4px' }}></td>
                        <td style={{ border: '1px solid black', padding: '4px' }}>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid black', padding: '4px' }}><b>
                            Name of Participant/Patient/Legal
                            Representative or Parent/Guardian</b>
                        </td>
                        <td style={{ border: '1px solid black', padding: '4px' }}><b>Signature</b></td>
                        <td style={{ border: '1px solid black', padding: '4px' }}><b>Date & Time </b>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ height: '35px', border: '1px solid black', padding: '4px' }}>
                        </td>
                        <td style={{ border: '1px solid black', padding: '4px' }}></td>
                        <td style={{ border: '1px solid black', padding: '4px' }}>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid black', padding: '4px' }}><b>Name of the Witness
                            (if participant, patient, representative
                            or parent does not read) </b>
                        </td>
                        <td style={{ border: '1px solid black', padding: '4px' }}><b>Witness’s
                            Signature</b></td>
                        <td style={{ border: '1px solid black', padding: '4px' }}><b>Date & Time</b>
                        </td>
                    </tr>
                </tbody>
            </table>
            <p></p>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <table style={{
                    borderCollapse: 'collapse',
                    fontSize: '12px',
                    border: '1px solid black',
                }}>
                    <tbody>
                        <tr>
                            <td style={{ border: '1px solid black', padding: '4px' }}>Form
                                Number
                            </td>
                            <td style={{ border: '1px solid black', padding: '4px' }}>Version</td>
                            <td style={{ border: '1px solid black', padding: '4px' }}>Referenced
                                Policy
                            </td>
                            <td style={{ border: '1px solid black', padding: '4px' }}>Last
                                Review
                            </td>

                        </tr>
                        <tr>
                            <td style={{ border: '1px solid black', padding: '4px' }}>RGS F010
                            </td>
                            <td style={{ border: '1px solid black', padding: '4px' }}>3.0</td>
                            <td style={{
                                border: '1px solid black',
                                padding: '4px'
                            }}>RGS-P001
                            </td>
                            <td style={{
                                border: '1px solid black',
                                padding: '4px'
                            }}>May-2023
                            </td>

                        </tr>
                    </tbody>
                </table>
            </div>

        </div>

    );
};

export default EnglishConsent;
