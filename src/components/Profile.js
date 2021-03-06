import React, { useState } from 'react';
import { useObject, useListVals } from 'react-firebase-hooks/database';
import firebase from 'firebase';
import { DraggableAreasGroup } from 'react-draggable-tags';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import RemoveIcon from '@material-ui/icons/Remove';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../hooks/use-auth';

import SEO from '../components/Seo';

const group = new DraggableAreasGroup();
const DraggableArea1 = group.addArea();
const DraggableArea2 = group.addArea();

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  tag: {
    position: 'relative',
    margin: '3px',
    fontSize: '16px',
    border: '2px dashed #cccccc',
    borderRadius: '4px',
    padding: theme.spacing(1),
    lineHeight: '30px',
    color: '#666666',
    cursor: 'pointer',
    background: 'rgba(255, 255, 255, 0.7)',
  },
  tagSelected: {
    border: '2px dashed #3b9de9;',
  },
  deleteBtn: {
    position: 'absolute',
    top: '-1px',
    right: '-1px',
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    userDrag: 'none',
    userSelect: 'none',
  },
  dragableBox: {
    minHeight: '100px',
    maxHeight: '60vh',
    overflowY: 'scroll',
    background: 'rgba(0, 0, 0, 0.05)',
  },
  searchBox: {
    paddingBottom: theme.spacing(1),
  },
}));

function filter(text, searchString) {
  const regexStr = '(?=.*' + searchString.split(/\,|\s/).join(')(?=.*') + ')';
  const searchRegEx = new RegExp(regexStr, 'gi');
  return text.match(searchRegEx) !== null;
}

const Profile = () => {
  const classes = useStyles();
  const { profile } = useAuth();
  const [user] = useObject(firebase.database().ref(`/users/${profile?.uid}`));
  const [tags] = useListVals(firebase.database().ref(`/tags`));
  const [newTagName, setNewTagName] = useState('');
  const [searchTag, setSearchTag] = useState('');
  const userData = user?.val();

  const userTags = userData?.tags || [];

  const leftTags = tags
    .filter(tag => !userTags.some(userTag => userTag.uid === tag.uid))
    .filter(element => filter(element.tagName, searchTag));

  const updateUserTags = tags => {
    const updates = {
      [`/users/${profile?.uid}/tags`]: tags,
    };
    firebase
      .database()
      .ref()
      .update(updates);
  };

  const handleClickDelete = tag => {
    updateUserTags(userTags.filter(item => item.uid !== tag.uid));
  };

  const handleClickAdd = tag => {
    updateUserTags([...userTags, tag]);
  };

  const handleAddNewTag = () => {
    const newId = uuidv4();
    let newPostKey = firebase
      .database()
      .ref()
      .child('tags')
      .push().key;
    const updates = {
      [`/tags/${newPostKey}`]: {
        uid: newId,
        tagName: newTagName,
      },
    };
    firebase
      .database()
      .ref()
      .update(updates);
    setNewTagName('');
  };

  const setTagName = tagName => {
    setNewTagName(tagName.target.value);
  };

  const handleSearchTag = tagName => {
    setSearchTag(tagName.target.value);
  };
  return (
    <React.Fragment>
      <SEO title="Page two" />
      <h1>Select your interests</h1>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <Grid
              container
              justify="center"
              alignItems="flex-end"
              className={classes.searchBox}
            >
              <Grid item xs={12}>
                <TextField
                  required
                  id="searchTag"
                  name="searchTag"
                  label="Search"
                  onChange={handleSearchTag}
                  value={searchTag}
                  fullWidth
                />
              </Grid>
            </Grid>
            <DraggableArea1
              className={classes.dragableBox}
              tags={leftTags}
              render={({ tag }) => (
                <div
                  key={tag.uid}
                  onClick={() => handleClickAdd(tag)}
                  className={classes.tag}
                >
                  {tag.tagName}
                </div>
              )}
            />
            <Grid container justify="center" alignItems="flex-end">
              <Grid item xs={9}>
                <TextField
                  required
                  id="tagName"
                  name="tagName"
                  label="Tag name"
                  onChange={setTagName}
                  value={newTagName}
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={newTagName.length < 1}
                  onClick={handleAddNewTag}
                  className={classes.button}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <DraggableArea2
              className={classes.dragableBox}
              tags={userTags}
              render={({ tag }) => (
                <div
                  key={tag.uid}
                  className={classes.tag + ' ' + classes.tagSelected}
                  onClick={() => handleClickDelete(tag)}
                >
                  <RemoveIcon
                    color={'secondary'}
                    className={classes.deleteBtn}
                  />
                  {tag.tagName}
                </div>
              )}
              onChange={rightTags => {
                updateUserTags(rightTags);
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Profile;
