import express from "express";
import user from "../models/user";
import firms from "../models/firms";
import appointment from "../models/appointment";
import appointment_archive from "../models/appointment_archive";
import mongoose from "mongoose";

export class DecoratorController {


    grabAllAppointmentsForDecorator = (req: express.Request, res: express.Response) => {
        let firm = req.body.firmName;
        firms.findOne( { name: firm }).then( (data) => {
          if (data) {
            appointment.find({ 'firm._id': data._id, decoratorDecision: 'pending' }).then((data) => {
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

    confirmAppointment = (req: express.Request, res: express.Response) => {
        let appointment_id = req.body.appointment_id;
        let decorator_id = req.body.decorator_id;

        appointment.updateOne( { _id: appointment_id }, { $set : { decorator_id: decorator_id, decoratorDecision : 'confirmed' }})
        .then( (data) => {
            res.json(data);
        })
        .catch( (err) => {
            console.log(err);
            res.json("");
        })

    };


    rejectAppointment = (req: express.Request, res: express.Response) => {
        let appointment_id = req.body.appointment_id;
        let rejectionComment = req.body.rejectionComment;
    

        appointment.updateOne( { _id: appointment_id }, { $set : { rejectionComment: rejectionComment, decoratorDecision : 'denied' }})
        .then( (data) => {
            res.json(data);
        })
        .catch( (err) => {
            console.log(err);
            res.json("");
        })

    };

    grabAllMaintenenceForDecorator = (req: express.Request, res: express.Response) => {
      let firm = req.body.firmName;
      firms.findOne( { name: firm }).then( (data) => {
        if (data) {
          appointment.find({ 'firm._id': data._id, decoratorDecision: 'maintenenceWaiting' }).then((data) => {
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


  confirmMaintenance = (req: express.Request, res: express.Response) => {
    let appointmentId = req.body.appointmentId;
    let date = req.body.date; 
    let time = req.body.time;

    

    appointment.findByIdAndUpdate(appointmentId, { $set : { date: date, time: time, decoratorDecision: 'confirmed'}}).then( (data) => {
      if(data){
        res.json("success");
      }
    }).catch( err => { console.log(err); res.json(""); })
  
  };

  getJobsPerMonth = async (req: express.Request, res: express.Response) => {
    const decoratorID = req.body.decoratorID;
  
    try {
      const appointmentsQuery = appointment.aggregate([
        { $match: { decorator_id: new mongoose.Types.ObjectId(decoratorID) } },
        {
          $group: {
            _id: { month: { $month: "$date" }, year: { $year: "$date" } },
            jobCount: { $sum: 1 }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]);
  
      const appointmentsArchiveQuery = appointment_archive.aggregate([
        { $match: { decorator_id: new mongoose.Types.ObjectId(decoratorID) } },
        {
          $group: {
            _id: { month: { $month: "$date" }, year: { $year: "$date" } },
            jobCount: { $sum: 1 }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]);
  
      // Execute both queries in parallel
      const [appointmentsData, appointmentsArchiveData] = await Promise.all([
        appointmentsQuery,
        appointmentsArchiveQuery
      ]);
  
      // Merge the results
      const combinedData = [...appointmentsData, ...appointmentsArchiveData];
  
      // Group the results by year and month and aggregate job counts
      const groupedData = combinedData.reduce((acc: any, current: any) => {
        const key = `${current._id.year}-${current._id.month}`;
        if (!acc[key]) {
          acc[key] = { ...current._id, jobCount: current.jobCount };
        } else {
          acc[key].jobCount += current.jobCount;
        }
        return acc;
      }, {});
  
      // Convert the grouped data to an array
      const result = Object.values(groupedData);
  
      // Transform result into months and jobCount arrays
      const months = result.map((item: any) => `${item.month}-${item.year}`);
      const jobsCount = result.map((item: any) => item.jobCount);
  
      // Send the transformed data
      res.json({ months, jobsCount });
    } catch (err) {
      console.error(err);
      res.json();
    }
  };

  getJobDistributionForFirm = async (req: express.Request, res: express.Response) => {
    const firmName = req.body.firmName;
  
    try {
      // Step 1: Fetch the decorators for the firm (assuming 'User' model contains decorators with `firstname` and `lastname`)
      const decorators = await user.find({ firmName }, '_id firstname lastname');
  
      
      if (!decorators.length) {
        return res.json({ decoratorNames: [], jobCounts: [] });
      }

  
      // Step 2: Create a map of fullName to decorator ID
      const decoratorMap = decorators.reduce((acc: Record<string, mongoose.Types.ObjectId>, decorator) => {
        const fullName = `${decorator.firstname || 'Unknown'} ${decorator.lastname || 'Unknown'}`;
        acc[fullName] = decorator._id;
        return acc;
      }, {});
  
      // Step 3: Extract decorator names and IDs
      const decoratorNames = Object.keys(decoratorMap); // List of decorator names
      const decoratorIDs = Object.values(decoratorMap); // List of decorator IDs
  
      // Step 4: Query appointments and appointments_archive for job counts per decorator
      const appointmentsQuery = appointment.aggregate([
        { $match: { decorator_id: { $in: decoratorIDs } } }, // Match by decorator IDs
        { $group: { _id: "$decorator_id", jobCount: { $sum: 1 } } }
      ]);
  
      const appointmentsArchiveQuery = appointment_archive.aggregate([
        { $match: { decorator_id: { $in: decoratorIDs } } }, // Match by decorator IDs
        { $group: { _id: "$decorator_id", jobCount: { $sum: 1 } } }
      ]);
  
      // Step 5: Execute both queries in parallel
      const [appointmentsData, appointmentsArchiveData] = await Promise.all([appointmentsQuery, appointmentsArchiveQuery]);
  
      // Step 6: Combine data from both collections
      const combinedData = [...appointmentsData, ...appointmentsArchiveData];
  
      // Step 7: Group by decorator ID and sum job counts
      const jobCountsMap = combinedData.reduce((acc: Record<string, number>, current: any) => {
        const decoratorID = current._id.toString(); // Convert ObjectId to string
        acc[decoratorID] = (acc[decoratorID] || 0) + current.jobCount; // Sum job counts
        return acc;
      }, {});
  
      // Step 8: Map job counts to decorator names
      const jobCounts = decoratorNames.map(name => jobCountsMap[decoratorMap[name]?.toString()] || 0);
  

      // Step 9: Send the result to the client
      res.json({ decoratorNames, jobCounts });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    }
  };
  
  getAverageJobsPerDay = async (req: express.Request, res: express.Response) => {
    const decoratorID = req.body.decoratorID;
  
    try {
      // Group by day of the week and count the jobs
      const appointmentsQuery = appointment.aggregate([
        { $match: { decorator_id: new mongoose.Types.ObjectId(decoratorID) } }, 
        {
          $group: {
            _id: { dayOfWeek: { $dayOfWeek: "$date" } }, // Group by day of the week
            jobCount: { $sum: 1 }
          }
        }
      ]);
  
      const appointmentsArchiveQuery = appointment_archive.aggregate([
        { $match: { decorator_id: new mongoose.Types.ObjectId(decoratorID) } }, 
        {
          $group: {
            _id: { dayOfWeek: { $dayOfWeek: "$date" } }, // Group by day of the week
            jobCount: { $sum: 1 }
          }
        }
      ]);
  
      // Execute both queries in parallel
      const [appointmentsData, appointmentsArchiveData] = await Promise.all([
        appointmentsQuery,
        appointmentsArchiveQuery
      ]);
  
      // Combine the results
      const combinedData = [...appointmentsData, ...appointmentsArchiveData];

  
      // Group the data by day of the week and calculate the total job counts
      const groupedData = combinedData.reduce((acc: any, current: any) => {
        const dayOfWeek = current._id.dayOfWeek;
        if (!acc[dayOfWeek]) {
          acc[dayOfWeek] = { dayOfWeek, jobCount: current.jobCount };
        } else {
          acc[dayOfWeek].jobCount += current.jobCount;
        }
        return acc;
      }, {});
  

      // Calculate the average jobs per day of the week over 24 months
      const averageData = Object.values(groupedData).map((day: any) => ({
        dayOfWeek: day.dayOfWeek,
        averageJobCount: day.jobCount / 24 // Divide the total job count by 24 months
      }));
  
      res.json(averageData);
    } catch (err) {
      console.error(err);
      res.json([]);
    }
  };
  

}