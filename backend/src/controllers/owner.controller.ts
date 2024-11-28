import express from "express";
import user from "../models/user";
import appointment from "../models/appointment";
import appointment_archive from "../models/appointment_archive";

export class OwnerController {

  grabAvailableDecorators = (req: express.Request, res: express.Response) => {
    let firmName = req.body.firmName;

    user
      .find({ firmName: firmName, busy: false })
      .then((data) => {
        if (data) {
          res.json(data);
        } else {
          res.json("");
        }
      })
      .catch((err) => {
        console.log(err);
        res.json("");
      });
  };


  // Controller function to create an appointment
  createAppointment = (req: express.Request, res: express.Response) => {
    // Step 1: Extract the form data from the request
    const appointmentDetails = req.body;

    // Step 2: Parse any fields that were converted to strings in the FormData
    const servicesArray = JSON.parse(appointmentDetails.services);
    const firmObject = JSON.parse(appointmentDetails.firm);
    const ownerObject = JSON.parse(appointmentDetails.owner);
    const gardenObject = JSON.parse(appointmentDetails.gardenLayout);

    const firmFormatted = {
      _id: firmObject._id,  // Correct ObjectId field
      name: firmObject.name
    };
    
    const ownerFormatted = {
      _id: ownerObject._id,  // Correct ObjectId field
      name: ownerObject.firstname + ' ' + ownerObject.lastname
    };
    
    // Create a new instance of the Appointment model
    const newAppointment = new appointment({
      schedulingDate: new Date(appointmentDetails.schedulingDate) || new Date(),
      date: new Date(appointmentDetails.date),
      time: appointmentDetails.time,
      squareFootage: parseFloat(appointmentDetails.squareFootage),
      gardenType: appointmentDetails.gardenType,
      services: servicesArray,  // The parsed services array
      additionalDescription: appointmentDetails.additionalDescription || '',
      firm: firmFormatted,  // The corrected firm object
      totalSquareFootage: parseFloat(appointmentDetails.totalSquareFootage),
      poolSquareFootage: parseFloat(appointmentDetails.poolSquareFootage) || 0,
      greenerySquareFootage: parseFloat(appointmentDetails.greenerySquareFootage) || 0,
      sunbedsSquareFootage: parseFloat(appointmentDetails.sunbedsSquareFootage) || 0,
      fountainSquareFootage: parseFloat(appointmentDetails.fountainSquareFootage) || 0,
      tableCount: parseInt(appointmentDetails.tableCount, 10) || 0,
      chairCount: parseInt(appointmentDetails.chairCount, 10) || 0,
      owner: ownerFormatted,
      decoratorDecision: 'pending',
      gardenLayout: gardenObject.elements
    });



    // Step 4: Save the appointment to the database
    newAppointment
      .save()
      .then((savedAppointment) => {
        res.json("success");
      })
      .catch((err) => {
        res.json("");
      });
  };

  grabAllAppointments = (req: express.Request, res: express.Response) => {
    let owner = req.body.ownerUsername;


    user.findOne( { username: owner }).then( (data) => {
      if (data) {
        appointment.find({ 'owner._id': data._id }).then((data) => {
            if (data) {
              res.json(data);
            } else {
              res.json("");
            }
          })
          .catch((err) => {
            console.log(err);
            res.json("");
          });
      } else {
        res.json("");
      }
    }).catch( (err) => {
      console.log(err);
      res.json("");
    })
  
  };


  grabAllAppointmentsForOwner = (req: express.Request, res: express.Response) => {
    let owner_id = req.body.owner_id;

    appointment.find( { 'owner._id' : owner_id, date: { $lte: new Date() }, decoratorDecision: { $nin : ['maintenenceWaiting']} }).then( (data) => {
      if (data) {
        res.json(data);
      }
    })
    .catch( (err) => {
        console.log(err);
    })

  }

  async scheduleMaintenance(req: express.Request, res: express.Response) {
    let appointmentDetails = req.body;

    const servicesArray = JSON.parse(appointmentDetails.services);
    const firmObject = JSON.parse(appointmentDetails.firm);
    const ownerObject = JSON.parse(appointmentDetails.owner);
    const gardenObject = JSON.parse(appointmentDetails.gardenLayout);

    const firmFormatted = {
      _id: firmObject._id,
      name: firmObject.name
    };
    
    const ownerFormatted = {
      _id: ownerObject._id,
      name: ownerObject.name
    };

    const newAppointmentArchive = new appointment_archive({
      schedulingDate: appointmentDetails.schedulingDate,
      date: appointmentDetails.date,
      time: appointmentDetails.time,
      squareFootage: parseFloat(appointmentDetails.squareFootage),
      gardenType: appointmentDetails.gardenType,
      services: servicesArray,
      additionalDescription: appointmentDetails.additionalDescription || '',
      firm: firmFormatted,
      totalSquareFootage: parseFloat(appointmentDetails.totalSquareFootage),
      poolSquareFootage: parseFloat(appointmentDetails.poolSquareFootage) || 0,
      greenerySquareFootage: parseFloat(appointmentDetails.greenerySquareFootage) || 0,
      sunbedsSquareFootage: parseFloat(appointmentDetails.sunbedsSquareFootage) || 0,
      fountainSquareFootage: parseFloat(appointmentDetails.fountainSquareFootage) || 0,
      tableCount: parseInt(appointmentDetails.tableCount, 10) || 0,
      chairCount: parseInt(appointmentDetails.chairCount, 10) || 0,
      owner: ownerFormatted,
      decoratorDecision: appointmentDetails.decoratorDecision,
      gardenLayout: gardenObject
    });

    try {
      const archiveResult = await newAppointmentArchive.save();
      if (archiveResult) {
        const updatedAppointment = await appointment.findOneAndUpdate(
          { _id: appointmentDetails._id },
          { $set: { date: 0, time: 0, decoratorDecision: 'maintenenceWaiting' } },
          { new: true }
        );

        if (updatedAppointment) {
          res.json("success");
        } else {
          res.json("");
        }
      }
    } catch (err) {
      console.log(err);
      res.json("");
    }
  }

  grabAllMaintenenceForOwner = (req: express.Request, res: express.Response) => {
    let owner_id = req.body.owner_id;

    appointment.find( { 'owner._id' : owner_id, decoratorDecision: 'maintenenceWaiting' }).then( (data) => {
      if (data) {
        res.json(data);
      }
    })
    .catch( (err) => {
        console.log(err);
    })

  }

}


