export const UNIQUE_CONSTRAINT_MESSAGES: Readonly<Record<string, string>> = {
    users_email_key: "Email already exists.",
    users_username_key: "Username already exists.",
}

export const FOREIGN_KEY_CONSTRAINT_MESSAGES: Readonly<Record<string, string>> = {
    // Scenario A: Inserting/Updating (Parent record missing)
    'orders_user_id_fkey': 'The specified user account does not exist.',
    'products_category_id_fkey': 'The selected product category is invalid.',

    // Scenario B: Deleting (Child records block deletion)
    'fk_user_profile': 'Cannot delete this user because they have active profile data attached.'
}

export const CONSTRAINT_MESSAGES: Readonly<Record<string, string>> = {
    chk_positive_amount: "Amount must be greater than zero.",
    chk_valid_date_range: "End date must be after start date.",
};