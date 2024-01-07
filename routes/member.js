const express = require("express");
const router = express.Router();
const Member = require("../models/member");
const authenticateToken = require("./authenticateToken");
const Community = require("../models/community");


router.post("/", authenticateToken, async (req, res) => {
  try {
    const { community, user, role } = req.body;
    const ownedCommunity = await Community.findOne({
      name: community,
      owner: req.userId,
    });


    if (!ownedCommunity) {
      return res
        .status(403)
        .json({ status: false, error: "NOT_ALLOWED_ACCESS" });
    }

   
    const member = await Member.create({ community, user, role });

    res.status(200).json({
      status: true,
      content: {
        data: {
          id: member._id,
          community: member.community,
          user: member.user,
          role: member.role,
          created_at: member.created_at,
        },
      },
    });
  } catch (error) {
    res.status(400).json({ status: false, error: error.message });
  }
});


router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const memberId = req.params.id;

   
    const membersToDelete = await Member.find({ user: memberId });
    const loginMember = await Member.find({
      user: req.userId,
      role: "Community Moderator",
    });

    
    if (
      (!membersToDelete || membersToDelete.length === 0) &&
      (!loginMember || loginMember.length == 0)
    ) {
      return res.status(404).json({ status: false, error: "Member not found" });
    }
    loginMember.forEach((member) => {
      console.log("loingMember community", member.community);
      console.log("loingMember username", member.user);
    });
    
    const ownedCommunities = await Community.find({ owner: req.userId });

   
    let booldelete = false;

    membersToDelete.forEach(async (member) => {
      let currentcommunity = member.community;
      const isOwner = ownedCommunities.some(
        (community) => community.name === currentcommunity
      );
      let currentcommunity1 = member.community;
      const ismoderator = loginMember.some(
        (member1) => member1.community === currentcommunity1
      );
      const nt = ownedCommunities.some((elm) => elm.name === currentcommunity);
      if (isOwner) {
        booldelete = true;
        await Member.findOneAndDelete({
          _id: member._id,
          community: currentcommunity,
        });
      }
      if (ismoderator&&!nt) {
        booldelete = true;
        await Member.findOneAndDelete({
          _id: member._id,
          community: currentcommunity1,
        });
      }
    });

    if (!booldelete) {
      return res
        .status(403)
        .json({ status: false, error: "NOT_ALLOWED_ACCESS" });
    }

    res.status(200).json({
      status: true,
      content: {
        message: "Member(s) removed successfully.",
      },
    });
  } catch (error) {
    res.status(400).json({ status: false, error: error.message });
  }
});

module.exports = router;
