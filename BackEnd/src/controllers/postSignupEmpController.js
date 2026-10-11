import Employee from '../models/Employee.js';
import { UPLOADS_DIR } from '../config/paths.js';
import { discardUpload, removeStoredFile } from '../utils/files.js';

const GENDERS = ['Male', 'Female', 'Other'];

const clean = (value) => (typeof value === 'string' ? value.trim() : value);

// Saves the "Personal Information" step for the logged-in employee.
// The account is identified by the session, never by values typed into the form.
export const saveEmployeeDetails = async (req, res) => {
    try {
        const { fullname, phoneNumber, collegeOrUniversity, address, district, gender, birthdate } = req.body;

        if (!clean(fullname)) {
            await discardUpload(req.file);
            return res.status(400).json({ message: 'Full name is required' });
        }

        const employee = await Employee.findById(req.session.user);
        if (!employee) {
            await discardUpload(req.file);
            return res.status(404).json({ message: 'Employee not found' });
        }

        employee.fullname = clean(fullname);
        if (phoneNumber !== undefined) employee.phoneNumber = clean(phoneNumber);
        if (collegeOrUniversity !== undefined) employee.collegeOrUniversity = clean(collegeOrUniversity);
        if (address !== undefined) employee.address = clean(address);
        if (district !== undefined) employee.district = clean(district);
        if (GENDERS.includes(gender)) employee.gender = gender;
        if (birthdate) {
            const parsed = new Date(birthdate);
            if (!Number.isNaN(parsed.getTime())) employee.birthdate = parsed;
        }

        // Only touch the picture when a new one was sent (it used to be overwritten with null).
        const previousImage = employee.profileImage;
        if (req.file) employee.profileImage = req.file.filename;

        await employee.save();
        if (req.file) await removeStoredFile(UPLOADS_DIR, previousImage);

        res.status(200).json({
            message: 'Employee details updated successfully',
            profileImage: employee.profileImage || '',
        });
    } catch (error) {
        await discardUpload(req.file);
        console.error('Error saving employee details:', error);
        res.status(500).json({ message: 'Failed to save employee details' });
    }
};
