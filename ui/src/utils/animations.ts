import { gsap } from "gsap";

//Login & SignUp Animations
export const setUpAnim = () => {
  gsap.to(".verification-container", 0.01, {
    xPercent: -100,
  });
  gsap.to(".sign-up-container", 0.01, {
    xPercent: -100,
  });
  gsap.to(".forgot-password-container", 0.01, {
    xPercent: 100,
  });
  gsap.to(".password-reset-container", 0.01, {
    xPercent: 100,
  });
};

export const loginPanelSignUpAnim = () => {
  gsap.to(".sign-in-container", 0.5, {
    xPercent: 100,
    ease: "back.inOut(1.7)",
  });
  gsap.to(".sign-up-container", 0.5, {
    xPercent: 0,
    ease: "back.inOut(1.7)",
  });
  gsap.to(".verification-container", 0.5, {
    xPercent: -100,
    ease: "back.inOut(1.7)",
  });
  gsap.to(".forgot-password-container", 0.5, {
    xPercent: 100,
    ease: "back.inOut(1.7)",
  });
  gsap.to(".password-reset-container", 0.5, {
    xPercent: 100,
    ease: "back.inOut(1.7)",
  });
};

export const loginPanelVerifyAnim = () => {
  gsap.to(".sign-up-container", 0.5, {
    xPercent: 100,
    ease: "back.inOut(1.7)",
  });
  gsap.to(".sign-in-container", 0.5, {
    xPercent: 100,
    ease: "back.inOut(1.7)",
  });
  gsap.to(".verification-container", 0.5, {
    xPercent: 0,
    ease: "back.inOut(1.7)",
  });
  gsap.to(".forgot-password-container", 0.5, {
    xPercent: 100,
    ease: "back.inOut(1.7)",
  });
  gsap.to(".password-reset-container", 0.5, {
    xPercent: 100,
    ease: "back.inOut(1.7)",
  });
};

export const loginPanelSignInAnim = () => {
  gsap.to(".sign-in-container", 0.5, {
    xPercent: 0,
    ease: "back.inOut(1.7)",
  });
  gsap.to(".sign-up-container", 0.5, {
    xPercent: -100,
    ease: "back.inOut(1.7)",
  });
  gsap.to(".verification-container", 0.5, {
    xPercent: -100,
    ease: "back.inOut(1.7)",
  });
  gsap.to(".forgot-password-container", 0.5, {
    xPercent: 100,
    ease: "back.inOut(1.7)",
  });
  gsap.to(".password-reset-container", 0.5, {
    xPercent: 100,
    ease: "back.inOut(1.7)",
  });
};

export const loginPanelForgotPasswordAnim = () => {
  gsap.to(".sign-in-container", 0.5, {
    xPercent: -100,
    ease: "back.inOut(1.7)",
  });
  gsap.to(".sign-up-container", 0.5, {
    xPercent: -100,
    ease: "back.inOut(1.7)",
  });
  gsap.to(".verification-container", 0.5, {
    xPercent: -100,
    ease: "back.inOut(1.7)",
  });
  gsap.to(".forgot-password-container", 0.5, {
    xPercent: 0,
    ease: "back.inOut(1.7)",
  });
  gsap.to(".password-reset-container", 0.5, {
    xPercent: 100,
    ease: "back.inOut(1.7)",
  });
};

export const loginPanelPasswordResetAnim = () => {
  gsap.to(".sign-in-container", 0.5, {
    xPercent: -100,
    ease: "back.inOut(1.7)",
  });
  gsap.to(".sign-up-container", 0.5, {
    xPercent: -100,
    ease: "back.inOut(1.7)",
  });
  gsap.to(".verification-container", 0.5, {
    xPercent: -100,
    ease: "back.inOut(1.7)",
  });
  gsap.to(".forgot-password-container", 0.5, {
    xPercent: -100,
    ease: "back.inOut(1.7)",
  });
  gsap.to(".password-reset-container", 0.5, {
    xPercent: 0,
    ease: "back.inOut(1.7)",
  });
};

/*
	Error Anims
*/

export const loginErrorAnim = () => {
  gsap.to(".panel-container", 0.06, {
    x: "+=20",
    yoyo: true,
    repeat: 3,
  });
};

export const postErrorAnim = () => {
  gsap.to(".form-container", 0.06, {
    x: "+=20",
    yoyo: true,
    repeat: 3,
  });
};

export const loginErrorClear = () => {
  gsap.to(".login-error-container", 0.1, {
    opacity: 0,
  });
  gsap.to(".form-container, .overlay-panel, .overlay-create, .overlay-member, .login-banner", 0.01, {
    y: 0,
  });
};

//Demo Start Animation
export const demoHeaderAnimation = () => {
  gsap.from(".demo-main-header", 1, {
    y: -200,
  });
  gsap.to(".demo-main-header", 1, {
    opacity: 1,
  });
};
export const demoHeadAnimation = () => {
  gsap.to(".demo-img-head", 2, { opacity: 1 });
  gsap.to(".demo-img-head", 0.5, { delay: 2, scale: 1.3, repeat: -1 });
};
export const demoArrowAnimation = () => {
  gsap.to(".demo-img-arrows", 2, {
    opacity: 1,
  });
  gsap.to(".demo-img-arrows", 0.5, { delay: 2, scale: 1.3, repeat: -1 });
  gsap.to(".demo-img-arrows", 2, {
    delay: 3,
    rotation: -360,
    repeat: -1,
  });
};
export const demoRedirectAnimation = () => {
  gsap.to(".demo-redirect", 2, {
    delay: 3,
    opacity: 1,
  });
};

//Contact Seller animation
export const contactSellerAnimation = () => {
  gsap.from(".contact-seller-trade", 1.5, {
    x: -300,
    ease: "bounce.out",
  });
  gsap.from(".contact-seller-message", 1.5, {
    x: 300,
    ease: "bounce.out",
  });
  gsap.to(".contact-seller-container", 1, {
    opacity: 1,
  });
};

//Upload avatar
export const avatarFormIn = () => {
  gsap.from(".edit-profile-form", 0.6, {
    y: -500,
    ease: "back.out(1.3)",
  });
  gsap.to(".edit-profile-form", 0.1, {
    opacity: 1,
  });
};

export const avatarFormOut = () => {
  gsap.to(".edit-profile-form", 0.6, {
    opacity: 0,
  });
};

//Confirm Trade Delete Form
export const confirmFormIn = () => {
  gsap.from(".confirm-delete-form", 0.6, {
    y: -500,
    ease: "back.out(1.3)",
  });
  gsap.to(".confirm-delete-form", 0.1, {
    opacity: 1,
  });
};

export const confirmFormOut = () => {
  gsap.to(".confirm-delete-form", 0.6, {
    opacity: 0,
  });
};

//Trade feedback animation
export const tradeFeedback = () => {
  gsap.to(".feedback-image", 2, {
    opacity: 1,
  });
  gsap.from(".feedback-image", 2, {
    scale: 0.2,
  });
  gsap.to(".feedback-header", 2, {
    opacity: 1,
  });
  gsap.from(".feedback-header", 2, {
    x: 400,
    ease: "back.out(1.7)",
  });
};

//Feedback alert animation
export const alertMessage = () => {
  gsap.to(".submit-feedback-alert", 1, {
    scale: 1.2,
    opacity: 1,
  });
  gsap.to(".submit-feedback-alert", 1, {
    delay: 3,
    scale: 1,
    opacity: 0,
  });
};
