class UserDto {
  constructor(user) {
    this.name = `${user.first_name}  ${user.last_name}`;
    this.email = user.email;
    this.active = true;
  }
}

module.exports = {
  UserDto,
};
