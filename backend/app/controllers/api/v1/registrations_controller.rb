# frozen_string_literal: true

module Api
  module V1
    class RegistrationsController < ApplicationController
      # POST /api/v1/sign_up
      def create
        user = User.new(sign_up_params)

        if user.save
          render json: { user: { id: user.id, email: user.email } }, status: :created
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def sign_up_params
        params.require(:user).permit(:email, :password, :password_confirmation)
      end
    end
  end
end
