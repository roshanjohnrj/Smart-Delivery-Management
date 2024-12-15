const MetricCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white p-4 rounded-lg shadow flex items-center">
      {Icon && <Icon className={`mr-4 ${color}`} />}
      <div>
        <p className="text-gray-500">{label}</p>
        <h2 className="text-2xl font-bold">{value}</h2>
      </div>
    </div>
  );

  export {MetricCard}