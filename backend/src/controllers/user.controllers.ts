import express from "express";
import user from "../models/user";
import fs from "fs";
import requests from "../models/requests";
import firms from "../models/firms";
import bcrypt from 'bcryptjs';
import appointment from "../models/appointment";

export class UserController {
  login = async (req: express.Request, res: express.Response) => {
    let username = req.body.username;
    let password = req.body.password;

    user
      .findOne({ username: username })
      .then(async (user) => {
        try {
          if (user && user.password) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
              console
              res.json(user);
            }
            else {
              res.json("");
            }
          }
          else {
            res.json("");
          }
        }
        catch(err) {
          console.log(err);
          res.json("");
        }
      })
      .catch((err) => console.log(err));
  };

  tryChangePassword = async (req: express.Request, res: express.Response) => {
    let username = req.body.username;
    let password = req.body.password;
    let newPassword = req.body.newPassword;

    const hashedNewPassword = await bcrypt.hash(newPassword, 10); // 10 is the salt rounds

    user
      .findOneAndUpdate(
        { username: username },
        { $set: { password: hashedNewPassword } }
      )
      .then((user) => {
        if (user) {
          res.json("");
        } else {
          res.json("User with given credentials doesn't exist");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getUserByUsername = (req: express.Request, res: express.Response) => {
    // Grab data
    let username = req.body.username;

    user
      .findOne({ username: username })
      .then((data) => {
        if (data) {
          res.json(data);
        } else {
          res.json("");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  grabUserByEmail = (req: express.Request, res: express.Response) => {
    // Grab data
    let email = req.body.email;

    user
      .findOne({ email: email })
      .then((data) => {
        if (data) {
          res.json(data);
        } else {
          requests.findOne({ "user.email": email }).then((data) => {
            if (data) {
              res.json(data);
            } else {
              res.json("");
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  registerUser = async (req: express.Request, res: express.Response) => {
    const file = req.file;
    // Handle file upload and form data
    const formData = req.body;

    const hashedNewPassword = await bcrypt.hash(formData.password, 10); // 10 is the salt rounds

    if (file) {
      // Create a new user instance with profilePicture.filename if available
      let newUser = new user({
        username: formData.username,
        password: hashedNewPassword,
        type: "owner",
        firstname: formData.firstname,
        lastname: formData.lastname,
        gender: formData.gender,
        isApproved: "pending",
        address: formData.address,
        contactPhone: parseInt(formData.phoneNumber),
        email: formData.email,
        creditCardNumber: parseInt(formData.creditCardNumber),
        profilePicture: fs.readFileSync(file.path),
        profilePictureType: file.mimetype,
      });

      // Create a new request instance
      const newRequest = new requests({
        user: newUser,
        approved: false,
      });

      // Save the request to MongoDB
      newRequest
        .save()
        .then(() => {
          fs.unlinkSync(file.path);
          res.json("Request for registration is created.");
        })
        .catch((err) => {
          console.error("Error creating request for registration:", err);
          res.status(500).json("Error creating request for registration.");
        });
    }
  };

  updateUser = async (req: express.Request, res: express.Response) => {
    const file = req.file;
    const formData = req.body;

    const hashedNewPassword = await bcrypt.hash(formData.password, 10); // 10 is the salt rounds

    // Build the updated data object
    let updatedData: any = {
      username: formData.username,
      password: hashedNewPassword, // Ensure you're hashing the password if necessary
      type: formData.type, // Modify this according to your logic
      firstname: formData.firstname,
      lastname: formData.lastname,
      gender: formData.gender,
      isApproved: 'true', // Modify based on your approval logic
      address: formData.address,
      contactPhone: parseInt(formData.phoneNumber),
      email: formData.email,
      creditCardNumber: parseInt(formData.creditCardNumber),
      firmName: formData.firmName
    };


    // If a file (profile picture) is uploaded, add it to the updatedData
    if (file) {
      updatedData.profilePicture = fs.readFileSync(file.path);
      updatedData.profilePictureType = file.mimetype;
    }

    // Update the user in the database and return the updated user info
    user
      .findOneAndUpdate(
        { username: formData.username },
        { $set: updatedData },
        { new: true }
      )
      .then((updatedUser) => {
        // Optionally remove the uploaded file after saving it in the database
        if (file) {
          fs.unlinkSync(file.path);
        }

        // Return the updated user information
        res.json(updatedUser);
      })
      .catch((err) => {
        res.json("");
      });
  };

  grabAllDecorators = (req: express.Request, res: express.Response) => {
    user
      .find({ type: "decorator", firmName: "" })
      .then((data) => {
        if (data) {
          res.json(data);
        } else {
          res.json("");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  addFirm = (req: express.Request, res: express.Response) => {
    // Grab data
    let name = req.body.name;
    let address = req.body.address;
    let services = req.body.services;
    let service_prices = req.body.service_prices;
    let longitude = req.body.longitude;
    let latitude = req.body.latitude;
    let decorator_list = req.body.decorator_list;
    let vacation_start = req.body.vacation_start;
    let vacation_end = req.body.vacation_end;
    let contactNumber = req.body.contactNumber;

    // Create a new instance of the Firms model
    const newFirm = new firms({
      name: name,
      address: address,
      services: services,
      service_prices: service_prices,
      longitude: longitude,
      latitude: latitude,
      decorator_list: decorator_list,
      vacation_start: new Date(vacation_start),
      vacation_end: new Date(vacation_end),
      contactNumber: contactNumber
    });

    let decorator_split_name: string[] = [];
    let decorator_split_username: string[] = [];

    decorator_list.forEach((decorator: string) => {
      let tmp_split = decorator.split("#");
      decorator_split_name.push(tmp_split[0]);
      decorator_split_username.push(tmp_split[1]);
    });

    newFirm.decorator_list = decorator_split_name;

    // Save the new firm to the database
    newFirm.save().then((data: any) => {
      user.updateMany(
          { username: { $in: decorator_split_username } },
          { $set: { firmName: newFirm.name } }
        )
        .then(() => {
          res.json("All decorators successfully updated");
        })
        .catch((err) => {
          console.error("Error updating decorators:", err);
          res.status(500).json("Error updating decorators");
        });
    });
  };

  getAllFirms = (req: express.Request, res: express.Response) => {
    firms
      .find()
      .then((data) => {
        if (data) {
          res.json(data);
        } else {
          res.json("");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  registerDecorator = async (req: express.Request, res: express.Response) => {
    const file = req.file;
    // Handle file upload and form data
    const formData = req.body;

    const hashedNewPassword = await bcrypt.hash(formData.password, 10); // 10 is the salt rounds

    if (file) {
      // Create a new user instance with profilePicture.filename if available
      let newUser = new user({
        username: formData.username,
        password: hashedNewPassword,
        type: formData.type,
        firstname: formData.firstname,
        lastname: formData.lastname,
        gender: formData.gender,
        isApproved: "approved",
        address: formData.address,
        contactPhone: parseInt(formData.phoneNumber),
        email: formData.email,
        creditCardNumber: parseInt(formData.creditCardNumber),
        profilePicture: fs.readFileSync(file.path),
        profilePictureType: file.mimetype,
        firmName: formData.firmName,
        busy: false
      });

      // Save the request to MongoDB
      newUser
        .save()
        .then(() => {
          fs.unlinkSync(file.path);
          res.json("Decorator created");
        })
        .catch((err) => {
          res.status(500).json("");
        });
    }
  };

  grabAllRequests = (req: express.Request, res: express.Response) => {
    requests
      .find({ approved: false })
      .then((data) => {
        if (data) {
          res.json(data);
        } else {
          res.json("");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  approveRequest = (req: express.Request, res: express.Response) => {
    const user_grabbed = req.body.user;
    const approved = req.body.approved;

    const newUser = new user({
      username: user_grabbed.username,
      password: user_grabbed.password, // Assuming the password is already hashed
      firstname: user_grabbed.firstname,
      lastname: user_grabbed.lastname,
      email: user_grabbed.email,
      type: user_grabbed.type,
      contactPhone: user_grabbed.contactPhone,
      gender: user_grabbed.gender,
      address: user_grabbed.address,
      creditCardNumber: user_grabbed.creditCardNumber,
      profilePicture: user_grabbed.profilePicture,
      profilePictureType: user_grabbed.profilePictureType,
      isApproved: user_grabbed.isApproved, // Set the approval status
    });

    newUser.save().then(() => {
      requests
        .updateOne(
          { "user.username": user_grabbed.username },
          { $set: { user: user_grabbed, approved: approved } }
        )
        .then(() => {
          res.json("request approved");
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  rejectRequest = (req: express.Request, res: express.Response) => {
    const user_grabbed = req.body.user;
    const approved = req.body.approved;

    requests
      .updateOne(
        { "user.username": user_grabbed.username },
        { $set: { user: user_grabbed, approved: approved } }
      )
      .then(() => {
        res.json("request denied");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  grabOwnersCount = (req: express.Request, res: express.Response) => {
    user
      .find({ type: "owner" })
      .count()
      .then((data: number) => {
        if (data) {
          res.json(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  grabDecoratorsCount = (req: express.Request, res: express.Response) => {
    user
      .find({ type: "decorator" })
      .count()
      .then((data: number) => {
        if (data) {
          res.json(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  grabDecoratedGardensCount = (req: express.Request, res: express.Response) => {
    appointment.find().count().then( data => { if (data) res.json(data) }).catch( err => { console.log(err); res.json(0)});
  }

  grabSchedualedGardensCount1 = (req: express.Request, res: express.Response) => {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    appointment
      .find({
        schedulingDate: { $gte: twentyFourHoursAgo }
      })
      .countDocuments()
      .then(data => {
        if (data) res.json(data);
        else res.json(0);
      })
      .catch(err => {
        console.log(err);
        res.json(0);
      });
  };

  grabSchedualedGardensCount7 = (req: express.Request, res: express.Response) => {
    // 7 days is 168h
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setHours(sevenDaysAgo.getHours() - 168);
  
    appointment
      .find({
        schedulingDate: { $gte: sevenDaysAgo }
      })
      .countDocuments()
      .then(data => {
        if (data) res.json(data);
        else res.json(0);
      })
      .catch(err => {
        console.log(err);
        res.json(0);
      });
  };

  grabSchedualedGardensCount30 = (req: express.Request, res: express.Response) => {
    // 7 days is 720h
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setHours(thirtyDaysAgo.getHours() - 720);
  
    appointment
      .find({
        schedulingDate: { $gte: thirtyDaysAgo }
      })
      .countDocuments()
      .then(data => {
        if (data) res.json(data);
        else res.json(0);
      })
      .catch(err => {
        console.log(err);
        res.json(0);
      });
  };
  
  
  grabAllDecoratorsAdminProfile  = (req: express.Request, res: express.Response) => {
    user.find( {type: 'decorator'}).then( (data) => { 
      if (data) 
        res.json(data) 
      }).catch((err) => { 
        console.log(err); 
        res.json("");
      })   
  }

  grabAllOwnersAdminProfile = (req: express.Request, res: express.Response) => {
    user.find( {type: 'owner'}).then( (data) => { 
      if (data) 
        res.json(data) 
      }).catch((err) => { 
        console.log(err); 
        res.json("");
      })   
  }


  grabAllFirmsAdminProfile = (req: express.Request, res: express.Response) => {
    firms.find().then( (data) => { if (data) res.json(data) }).catch((err) => { console.log(err); res.json("");})   
  }


  checkForFinishedAppointments = async (req: express.Request, res: express.Response) => {
    try {
      const decoratorID = req.body.decoratorID;
  
      // Step 1: Fetch all confirmed appointments by the decorator
      const result = await appointment.updateMany(
        {
          decorator_id: decoratorID,
          decoratorDecision: 'confirmed', 
          date: { $lt: new Date() } 
        },
        {
          $set: { decoratorDecision: 'maintenanceWaiting' }
        }
      );
  
      res.json("");
  
    } catch (err) {
      console.error('Error updating finished appointments:', err);
      res.status(500).json({ success: false, message: 'Error updating appointments.' });
    }
  };
  
  



}
