"use client";

export default function AboutUs() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">About Us</h1>
      <p className="text-gray-600 mb-4">
        Welcome to MyPetDiary! We are dedicated to providing the best pet care solutions for pet owners and veterinarians.
      </p>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
      <p className="text-gray-600 mb-4">
        At MyPetDiary, we strive to help pet owners and veterinarians manage and track the health and well-being of pets.
        Our mission is to offer a user-friendly platform that allows you to easily record, track, and analyze your pet's health data.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Features</h2>
      <ul className="list-disc list-inside text-gray-600 mb-4">
        <li><strong>Pet Profiles:</strong> Create detailed profiles for your pets, including their medical history, vaccinations, and more.</li>
        <li><strong>Veterinarian Access:</strong> Veterinarians can easily access and update pet medical records during visits.</li>
        <li><strong>Health Tracking:</strong> Keep track of your pet's weight, age, vaccinations, and medical treatments.</li>
        <li><strong>Reminders:</strong> Set up automatic reminders for vaccinations, check-ups, and other important health-related tasks.</li>
        <li><strong>Easy Communication:</strong> Stay connected with your veterinarian through our platform for any health concerns or advice.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why Choose Us?</h2>
      <p className="text-gray-600 mb-4">
        Whether you're a pet owner looking to keep your furry friend in the best shape, or a veterinarian needing an efficient way to track patient data, MyPetDiary has you covered. With easy-to-use features and a secure platform, we aim to make pet care management more efficient and effective.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get Started</h2>
      <p className="text-gray-600">
        Join the MyPetDiary community today and start managing your pet's health information in one secure, accessible place.
        <br />
        <a href="/auth/signup" className="text-blue-500 hover:text-blue-600">Sign up now</a> to get started!
      </p>
    </div>
  );
}