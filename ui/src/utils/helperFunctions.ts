import moment from 'moment';
import { PasswordResetForm, SignUpForm, VerificationForm } from './interfaces';

const emailLength = 7;
const vKeyLength = 5;

export default function setAppraisalImage(appraisal: number | undefined) {
	switch (appraisal) {
		case 0:
			return 'https://res.cloudinary.com/techlog-cloud-key/image/upload/v1612705445/Star0_krjjeh.png';
		case 1:
			return 'https://res.cloudinary.com/techlog-cloud-key/image/upload/v1612705445/Star1_gvfybl.png';
		case 2:
			return 'https://res.cloudinary.com/techlog-cloud-key/image/upload/v1612705445/Star2_byidda.png';
		case 3:
			return 'https://res.cloudinary.com/techlog-cloud-key/image/upload/v1612705445/Star3_hku77d.png';
		case 4:
			return 'https://res.cloudinary.com/techlog-cloud-key/image/upload/v1612705445/Star4_ypibwp.png';
	}
}

export const calcRating = (array: number[]) => {
	let totalRating: number = 0;
	array.forEach((rating: number) => {
		totalRating += rating;
	});
	const result = totalRating / array.length;
	return result;
};

export const validateCredentials = (createAccountForm: SignUpForm, ageChecked: boolean, isGoogleSignUp: boolean) => {
	if (createAccountForm.name.length <= 3) {
		return {
			error: 'display name is too short',
		};
	}
	if (!isGoogleSignUp) {
		if (createAccountForm.email.length <= emailLength) {
			return {
				error: 'email is too short',
			};
		}
		if (createAccountForm.password.length <= emailLength) {
			return {
				error: 'password is too short',
			};
		}
		if (createAccountForm.confirmPassword !== createAccountForm.password) {
			return {
				error: 'passwords do not match',
			};
		}
	}
	if (!ageChecked) {
		return {
			error: 'you must be 13 years or older to sign up',
		};
	}
	return {
		success: 'credentials passed check',
	};
};

export const validatevKey = (vKeyForm: VerificationForm) => {
	if (vKeyForm.vKey.length !== vKeyLength) {
		return {
			error: `verification key is ${vKeyLength} characters`,
		};
	}
	return {
		success: 'credentials passed check',
	};
};

export const validateEmail = (email: string) => {
	if (email.length <= emailLength) {
		return {
			error: `email is too short`,
		};
	}
	return {
		success: 'credentials passed check',
	};
};

export const validatePasswordResetForm = (createAccountForm: PasswordResetForm) => {
	if (createAccountForm.vKey.length !== vKeyLength) {
		return {
			error: `verification key is ${vKeyLength} characters`,
		};
	}
	if (createAccountForm.password.length <= emailLength) {
		return {
			error: 'password is too short',
		};
	}
	if (createAccountForm.confirmPassword !== createAccountForm.password) {
		return {
			error: 'passwords do not match',
		};
	}
	return {
		success: 'form passed check',
	};
};

export const howLongAgo = (date: any) => {
	const now = moment();
	const minutes = now.diff(date, 'minutes');
	const hours = now.diff(date, 'hours');
	const days = now.diff(date, 'days');
	const weeks = now.diff(date, 'weeks');
	const months = now.diff(date, 'months');
	const years = now.diff(date, 'years');
	//Used to be years ago || year ago, shortened but left extra ifs.
	if (years > 1) return `${years} y`;
	if (years === 1) return `${years} y`;
	if (months > 1) return `${months} m`;
	if (months === 1) return `${months} m`;
	if (weeks > 1) return `${weeks} w`;
	if (weeks === 1) return `${weeks} w`;
	if (days > 1) return `${days} d`;
	if (days === 1) return `${days} d`;
	if (hours > 1) return `${hours} h`;
	if (hours === 1) return `${hours} h`;
	if (minutes > 1) return `${minutes} m`;
	if (minutes === 1) return `${minutes} m`;
	else return 'just now';
};

export const generateRange = (start: number, end: number) => {
	var list = [];
	for (var i = start; i <= end; i++) {
		list.push(i);
	}
	return list;
};

export const findUnionForObjectArrays = (arrays: any) => {
	let resultIds: any = [];
	let resultTiles: any = [];
	arrays.forEach((array: any) => {
		array.forEach((tile: any) => {
			if (!resultIds.includes(tile.id) && checkIfIdInEveryArray(tile.id, arrays)) {
				resultIds.push(tile.id);
				resultTiles.push(tile);
			}
		});
	});
	return resultTiles;
};

const checkIfIdInEveryArray = (id: number, arrays: any) => {
	for (const array of arrays) {
		let doesArrayContainId = false;
		for (const tile of array) {
			if (tile.id === id) {
				doesArrayContainId = true;
				break;
			}
		}
		if (!doesArrayContainId) return false;
	}
	return true;
};
