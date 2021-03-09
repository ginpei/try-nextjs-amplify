import { DataStore } from "@aws-amplify/datastore";
import { useState } from "react";
import { Post } from "../../src/models";
import styles from "./PostItem.module.css";

export const PostItem: React.FC<{ post: Post }> = ({ post }) => {
  const [saving, setSaving] = useState(false);

  const onTitleClick = async () => {
    if (saving) {
      return;
    }

    // eslint-disable-next-line no-alert
    const title = window.prompt("Title", post.title);
    if (!title || title === post.title) {
      return;
    }

    setSaving(true);
    try {
      const newPost = Post.copyOf(post, (updated) => {
        // eslint-disable-next-line no-param-reassign
        updated.title = title;
      });
      await DataStore.save(newPost);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const onDeleteClick = async () => {
    // eslint-disable-next-line no-alert
    const ok = window.confirm(`Delete this?\n\n ${post.title}`);
    if (!ok) {
      return;
    }

    setSaving(true);
    try {
      await DataStore.delete(post);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <span
        className={`${styles.title} ${saving ? "" : "ui-link"}`}
        onClick={onTitleClick}
      >
        {post.title}
      </span>
      <span className="ui-pullRight">
        <button
          className="ui-iconButton"
          disabled={saving}
          onClick={onDeleteClick}
          title={`Delete "${post.title}"`}
        >
          🗑️
        </button>
      </span>
    </div>
  );
};
