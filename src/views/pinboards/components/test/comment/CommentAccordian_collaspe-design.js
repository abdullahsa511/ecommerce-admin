import Comment from './Comment.js';

export default {
    components: {
        Comment,
    },
    name: 'CommentAccordian',
    props: {
        commentData: {
            type: Array,
            required: false,
            default: () => ([])
        },
        comment: {
            type: Object,
            required: false,
        },
        job: {
            type: Object,
            required: false,
            default: null,
        },
        jobIdentifier: {
            type: String,
            required: false,
            default: '',
        },
        documentOrganisation: {
            type: Object,
            required: false,
            default: null,
        },
        replyEditor: {
            type: Object,
            required: false,
            default: () => ({
                identifier: '1',
                fullName: 'John Doe',
            }),
        },
        replyMentions: {
            type: Object,
            required: false,
            default: null,
        },
        replyFiles: {
            type: Object,
            required: false,
            default: null,
        },
        loading: {
            type: Object,
            required: false,
            default: null,
        },
        errors: {
            type: Object,
            required: false,
            default: null,
        },

        replyingComment: {
            type: String,
            required: false,
            default: '',
        },
        editingComment: {
            type: Object,
            required: false,
            default: null,
        },
        allowMentions: {
            type: String,
            required: false,
            default: 'Internal',
        },
    },
    data() {
        return {
            expanded: false,
            activeUser: 'John Doe',
            filteredComments: [
                {
                    identifier: '1',
                    content: 'Comment 1',
                },
                {
                    identifier: '2',
                    content: 'Comment 2',
                },
            ],
            loadedCommentCount: 2,
            commentMeta: {
                pagination: {
                    total: 10,
                },
            },
            showShowAllButton: true,
            showingJobComments: false,
            isDriverInstaller: false,
            expandedComments: [],
            loadingMore: false,
            targetComment: null,
            commentSection: 'Internal',
            isMobile: false,
            allowedFileTypes: null,
        };
    },
    methods: {
        resolveCommentKey(comment, index) {
            if (comment && comment.comment_id !== undefined && comment.comment_id !== null) {
                return String(comment.comment_id);
            }
            return String(index);
        },
        isCommentExpanded(commentKey) {
            const key = String(commentKey);
            return this.expandedComments.includes(key);
        },
        toggleCommentPanel(commentKey) {
            const key = String(commentKey);
            const expandedIndex = this.expandedComments.indexOf(key);
            if (expandedIndex !== -1) {
                this.expandedComments.splice(expandedIndex, 1);
                return;
            }
            this.expandedComments.push(key);
        },
        accordionHeaderId(commentKey) {
            const key = String(commentKey);
            return `comment-${key}-header`;
        },
        accordionContentId(commentKey) {
            const key = String(commentKey);
            return `comment-${key}-content`;
        },
        toggleExpanded() {
            this.expanded = !this.expanded;
        },
        toggleAllCommentExpand() {
            console.log('toggleAllCommentExpand');

        },
        loadAllComments() {
            console.log('loadAllComments');
        },
        loadJobComments() {
            console.log('loadJobComments');
        },
        loadComments() {
            console.log('loadComments');
        },
        jobIdentifierLocal() {
            return this.jobIdentifier ?? '';
        },
        clearReplyData() {
            console.log('clearReplyData');
        },
        addReplyMention() {
            console.log('addReplyMention');
        },
        removeReplyMention() {
            console.log('removeReplyMention');
        },
        embedReplyFiles() {
            console.log('embedReplyFiles');
        },
        removeEmbeddedReplyFile() {
            console.log('removeEmbeddedReplyFile');
        },
        createReply() {
            console.log('createReply');
        },
        onCommentReplyStart() {
            console.log('onCommentReplyStart');
        },
        onCommentEditStart() {
            console.log('onCommentEditStart');
        },
        onCommentEditCancel() {
            console.log('onCommentEditCancel');
        },
        addEditMention() {
            console.log('addEditMention');
        },
        removeEditMention() {
            console.log('removeEditMention');
        },
        editAddFile() {
            console.log('editAddFile');
        },
        editRemoveFile() {
            console.log('editRemoveFile');
        },
        submitCommentEdit() {
            console.log('submitCommentEdit');
        },
        deleteComment() {
            console.log('deleteComment');
        },
        upvoteComment() {
            console.log('upvoteComment');
        },
        removeCommentUpvote() {
            console.log('removeCommentUpvote');
        },
        upvoteReply() {
            console.log('upvoteReply');
        },
        removeReplyUpvote() {
            console.log('removeReplyUpvote');
        },
    },
    mounted() {
        console.log('commentData mountedcommentData:', this.commentData);
        if (this.commentData && this.commentData.length) {
            const firstKey = this.resolveCommentKey(this.commentData[0], 0);
            this.expandedComments = [firstKey];
        }
    },
    // watch: {
    //     commentData: {
    //         handler(newVal) {
    //             console.log('commentData changedcommmmmmmm:', newVal);
    //         },
    //         deep: true
    //     }
    // },

    template: /* html */ `
    <div class="comments-container pt-50">
        <div class="comments-container-top">
            <div class="expand-all-container">
                <button class="th-comment-btn-mini" type="button">
                    <span class="fa fa-angle-down"></span>
                    <span class="p-ink"></span>
                </button>
            </div>
            <div class="comments-container-top-right">
                <div class="comments-meta-info">
                    <small>{{ commentData.length }} of {{ commentData.length }}</small>
                </div>
                <div class="comments-show-all">
                    <button class="th-btn-primary text-capitalize" type="button">
                        <span class="p-button-label">Show Job Comments</span>
                        <span class="p-ink"></span>
                    </button>
                </div>
            </div>
        </div>

        <div class="p-accordion p-component" v-for="(comment, index) in commentData" :key="resolveCommentKey(comment, index)">
            <div :class="['p-accordion-tab', { 'p-accordion-tab-active': isCommentExpanded(resolveCommentKey(comment, index)) }]">
                <div :class="['p-accordion-header', { 'p-highlight': isCommentExpanded(resolveCommentKey(comment, index)) }, 'mb-5']">
                    <a role="tab"
                        class="p-accordion-header-link"
                        tabindex="0"
                        :aria-expanded="isCommentExpanded(resolveCommentKey(comment, index))"
                        :id="accordionHeaderId(resolveCommentKey(comment, index))"
                        :aria-controls="accordionContentId(resolveCommentKey(comment, index))"
                        @click.prevent="toggleCommentPanel(resolveCommentKey(comment, index))"
                        @keydown.enter.prevent="toggleCommentPanel(resolveCommentKey(comment, index))"
                        @keydown.space.prevent="toggleCommentPanel(resolveCommentKey(comment, index))">
                        <span :class="['p-accordion-toggle-icon', 'pi', isCommentExpanded(resolveCommentKey(comment, index)) ? 'pi-chevron-down' : 'pi-chevron-right']"></span>
                        <div class="d-flex align-items-center gap-2">
                            <i :class="['fa-solid', isCommentExpanded(resolveCommentKey(comment, index)) ? 'fa-angle-down' : 'fa-angle-right']"></i>
                            <span class="p-accordion-header-text">
                                Order Item &gt;
                                <a href="" target="_blank" onclick="event.stopPropagation()"> SPCSEA </a> -
                                <a href="" target="_blank" onclick="event.stopPropagation()">
                                    OK01YDE-3B
                                    <i class="ml-1 far fa-external-link"></i>
                                </a>
                                - Space Mesh Back - Black Fabric Seat | White Frame-For Repair
                            </span>
                        </div>
                    </a>
                </div>
                <div class="p-toggleable-content"
                    role="region"
                    :id="accordionContentId(resolveCommentKey(comment, index))"
                    :aria-labelledby="accordionHeaderId(resolveCommentKey(comment, index))"
                    :aria-hidden="!isCommentExpanded(resolveCommentKey(comment, index))"
                    v-show="isCommentExpanded(resolveCommentKey(comment, index))">
                    <div class="p-accordion-content">
                        <div class="comment-display" id="comment_ca676e34-e751-447f-bf11-530cdad9fbea" ismobile="false">
                            <div class="comment-user-image">
                                <div class="p-avatar p-component p-avatar-image p-avatar-circle p-avatar-xl">
                                    <img src="/img/account-dashboard/profile-pic.png" alt="profile picture">
                                </div>
                            </div>
                            <div class="comment-content">
                                <div class="comment-top-content">
                                    <div class="comment-user-and-likes">
                                        <div class="comment-user-name">
                                            <span>Arvind Kamath</span>
                                        </div>
                                        <div class="comment-upvotes">
                                            <div class="upvote-button-container">
                                                <button
                                                    class="p-button p-component p-button-icon-only p-button-link user-liked"
                                                    type="button">
                                                    <span class="fas fa-thumbs-up p-button-icon big-icon"></span>
                                                    <span class="p-ink"></span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="comment-time">Wed 21/1/26 1:54pm</div>
                                </div>
                                <div class="auto-comment-mention-tags"></div>
                                <div class="comment-message">
                                    <p>
                                        <span class="mention" data-index="1" data-denotation-char="@"
                                            data-id="11b01a01-1483-40a5-a2c6-52d98e8eb4fe" data-value="Chair Assembly NSW">﻿
                                            <span contenteditable="false">
                                                <span class="ql-mention-denotation-char">@</span>
                                                Chair Assembly NSW
                                            </span>﻿
                                        </span>
                                        Please confirm what items from stock are required to complete this repair.
                                    </p>
                                </div>
                                <br>
                                <h6 class="th-title-17">Delivered place and unpacked.</h6>
                                <div class="comment-attachments">
                                    <div class="file-preview">
                                        <img src="http://localhost:8089/media/design-resource/finishes/LX_Oyster-Linea_Natural.jpg"
                                            alt="file preview">
                                        <div v-if="false">
                                            <i class="fa-solid fa-file-pdf file-icon"></i>
                                            <caption>
                                                OK01YDE-3B.pdf
                                            </caption>
                                        </div>
                                    </div>
                                    <div class="file-preview">
                                        <img src="/img/account-dashboard/profile-pic.png" alt="file preview">
                                        <div v-if="false">
                                            <i class="fa-solid fa-file-pdf file-icon"></i>
                                            <caption>
                                                OK01YDE-3B.pdf
                                            </caption>
                                        </div>
                                    </div>
                                    <div class="file-preview">
                                        <img src="http://localhost:8089/media/design-resource/finishes/LX_Oyster-Linea_Natural.jpg"
                                            alt="file preview">
                                        <div v-if="false">
                                            <i class="fa-solid fa-file-pdf file-icon"></i>
                                            <caption>
                                                OK01YDE-3B.pdf
                                            </caption>
                                        </div>
                                    </div>
                                    <div class="file-preview">
                                        <img src="/img/account-dashboard/profile-pic.png" alt="file preview">
                                        <div v-if="false">
                                            <i class="fa-solid fa-file-pdf file-icon"></i>
                                            <caption>
                                                OK01YDE-3B.pdf
                                            </caption>
                                        </div>
                                    </div>
                                </div>
                                <div class="comment-footer">
                                </div>
                            </div>
                        </div>
                        <!-- ============ -->
                        <div class="comment-replies">
                            <div class="comment-display reply-display list-complete-item">
                                <div class="comment-user-image">
                                    <div class="p-avatar p-component p-avatar-image p-avatar-circle p-avatar-lg">
                                        <img src="https://kingmaker.ninja/profiles/thumbnail_Scott_Profile.jpg">
                                    </div>
                                    <div class="reply-connector"></div>
                                </div>
                                <div class="comment-content">
                                    <div class="comment-top-content">
                                        <div class="comment-user-and-likes">
                                            <div class="comment-user-name">
                                                <span>Scott Wilson</span>
                                            </div>
                                            <div class="comment-upvotes">
                                                <div class="upvote-button-container">
                                                    <button class="p-button p-component p-button-icon-only p-button-link"
                                                        type="button">
                                                        <span class="fas fa-thumbs-up p-button-icon big-icon"></span>
                                                        <span class="p-button-label">&nbsp;</span>
                                                        <span class="p-ink"></span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="comment-time">Thu 4/12/25 12:20pm</div>
                                    </div>
                                    <div class="auto-comment-mention-tags">
                                        <span class="mr-2">@Shofiul Alam</span>
                                    </div>
                                    <div class="comment-message">
                                        <p>Thanks Shofiul</p>
                                        <p>
                                            <span class="mention" data-index="0" data-denotation-char="@"
                                                data-id="6df77ee3-1577-11ed-8793-0242ac1f0003" data-value="Kevin Krost">
                                                ﻿
                                                <span contenteditable="false">
                                                    <span class="ql-mention-denotation-char">@</span>
                                                    Kevin Krost
                                                </span>﻿
                                            </span>
                                            Please update the item description so the warehouse knows what to pick
                                        </p>
                                        <p><br></p>
                                    </div>
                                    <div class="comment-footer"></div>
                                </div>
                            </div>
                            <div class="comment-display reply-display list-complete-item">
                                <div class="comment-user-image">
                                    <div class="p-avatar p-component p-avatar-image p-avatar-circle p-avatar-lg">
                                        <img src="https://kingmaker.ninja/profiles/thumbnail_55_KevinProfile_02.jpg">
                                    </div>
                                </div>
                                <div class="comment-content">
                                    <div class="comment-top-content">
                                        <div class="comment-user-and-likes">
                                            <div class="comment-user-name">
                                                <span>Kevin Krost</span>
                                            </div>
                                            <div class="comment-upvotes">
                                                <div class="upvote-button-container">
                                                    <button class="p-button p-component p-button-icon-only p-button-link"
                                                        type="button">
                                                        <span class="fas fa-thumbs-up p-button-icon big-icon"></span>
                                                        <span class="p-button-label">&nbsp;</span>
                                                        <span class="p-ink"></span>
                                                    </button>
                                                </div>
                                                <button class="upvote-count">
                                                    <span>2</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div class="comment-time">Thu 4/12/25 2:03pm</div>
                                    </div>
                                    <div class="auto-comment-mention-tags">
                                        <span class="mr-2">@Shofiul Alam</span>
                                    </div>
                                    <div class="comment-message">
                                        <p>Thanks Shof.</p>
                                        <p>
                                            <span class="mention" data-index="0" data-denotation-char="@"
                                                data-id="6e63ce76-1577-11ed-8793-0242ac1f0003" data-value="Scott Wilson">
                                                ﻿
                                                <span contenteditable="false">
                                                    <span class="ql-mention-denotation-char">@</span>
                                                    Scott Wilson</span>
                                                ﻿</span>
                                            Fixed.
                                        </p>
                                    </div>
                                    <div class="comment-footer"></div>
                                </div>
                            </div>
                        </div>





                        <div v-if="true" class="comment-editor reply-editor">
                            <div class="reply-editor-main">
                                <div class="comment-user-image">

                                </div>
                                <div class="reply-editor-input">
                                    <div class="auto-comment-mention-tags">
                                        <span class="mr-2">adasd</span>
                                    </div>
                                    <textarea name="" id="" class="form-control" rows="3"></textarea>
                                </div>
                            </div>
                            <div class="editor-buttons reply-buttons">
                                <div v-if="errors">
                                    <small class="p-error">{{ errors }}</small>
                                </div>
                                <div>
                                    <Button label="Cancel" />
                                </div>
                                <div>
                                </div>
                            </div>
                        </div>


                        <div class="comment-reply-button">
                            <button class="th-btn-outline-reply p-button-link" type="button">
                                <span class="fas fa-reply p-button-icon p-button-icon-left"></span>
                                <span class="p-button-label">Reply</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
}