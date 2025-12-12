const DoctorTags = ({ doctor }) => {
  const tags = Array.isArray(doctor?.tags) ? doctor.tags : [];
  const languages = Array.isArray(doctor?.languages) ? doctor.languages : [];

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, i) => (
        <span
          key={i}
          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
        >
          {tag}
        </span>
      ))}
      
      {languages.map((lang, i) => (
        lang && (
          <span
            key={`lang-${i}`}
            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
          >
            {lang}
          </span>
        )
      ))}
    </div>
  );
};

export default DoctorTags;